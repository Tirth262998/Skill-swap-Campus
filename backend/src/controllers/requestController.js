const ExchangeRequest = require("../models/ExchangeRequest");
const Profile = require("../models/Profile");
const Skill = require("../models/Skill");

const REQUEST_EXPIRY_MS = 10 * 24 * 60 * 60 * 1000;

const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return "Expired";

    const totalMinutes = Math.max(0, Math.floor(milliseconds / 60000));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    if (minutes > 0) return `${minutes}m left`;
    return `${Math.max(0, Math.floor(milliseconds / 1000))}s left`;
};

const getExpirationAt = (request) => {
    if (request.expirationAt) return new Date(request.expirationAt);

    const createdAt = request.createdAt ? new Date(request.createdAt) : new Date();
    return new Date(createdAt.getTime() + REQUEST_EXPIRY_MS);
};

const normalizeProfile = (profile) => ({
    userId: profile.userId.toString(),
    name: profile.name || "Student",
    department: profile.department || "Campus",
    year: profile.year || null,
    profileImage: profile.profileImage || null,
    bio: profile.bio || null,
});

const populateRequest = (request, currentUserId, profileMap, skillsByUserMap) => {
    const isSent = request.senderId.toString() === currentUserId.toString();
    const otherUserId = isSent ? request.recipientId : request.senderId;
    const otherProfile = profileMap.get(otherUserId.toString()) || null;
    const expirationAt = getExpirationAt(request);
    const isExpired = request.status === "expired" || expirationAt.getTime() <= Date.now();
    const pending = request.status === "pending";
    const timeLeft = pending ? formatTimeLeft(expirationAt.getTime() - Date.now()) : null;

    return {
        id: request._id.toString(),
        senderId: request.senderId.toString(),
        recipientId: request.recipientId.toString(),
        status: request.status,
        message: request.message || null,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        expiresAt: expirationAt.toISOString(),
        timeLeft,
        expiresSoon: pending && expirationAt.getTime() - Date.now() <= 48 * 60 * 60 * 1000,
        isExpired,
        otherUser: {
            id: otherUserId.toString(),
            name: otherProfile?.name || "Student",
            department: otherProfile?.department || "Campus",
            year: otherProfile?.year || null,
            profileImage: otherProfile?.profileImage || null,
        },
        skills: (skillsByUserMap.get(otherUserId.toString()) || []).map((skill) => ({
            id: skill._id.toString(),
            name: skill.name,
            type: skill.type,
        })),
    };
};

const getRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const requests = await ExchangeRequest.find({
            $or: [{ senderId: userId }, { recipientId: userId }],
        })
            .sort({ createdAt: -1 })
            .lean();

        if (!requests.length) {
            return res.status(200).json({
                success: true,
                message: "No exchange requests found.",
                data: {
                    requests: {
                        sent: [],
                        received: [],
                        summary: {
                            totalSent: 0,
                            totalReceived: 0,
                            pending: 0,
                            accepted: 0,
                            rejected: 0,
                            expired: 0,
                        },
                    },
                },
            });
        }

        const participantIds = requests.flatMap((request) => [
            request.senderId.toString(),
            request.recipientId.toString(),
        ]);

        const profiles = await Profile.find({ userId: { $in: participantIds } })
            .select("_id userId name department profileImage year bio availability")
            .lean();
        const profileMap = new Map();
        for (const profile of profiles) {
            profileMap.set(profile.userId.toString(), normalizeProfile(profile));
        }

        const skills = await Skill.find({ user: { $in: participantIds } })
            .select("_id user name type")
            .lean();
        const skillsByUserMap = new Map();
        for (const skill of skills) {
            const userKey = skill.user.toString();
            const currentSkills = skillsByUserMap.get(userKey) || [];
            currentSkills.push(skill);
            skillsByUserMap.set(userKey, currentSkills);
        }

        const sent = requests
            .filter((request) => request.senderId.toString() === userId.toString())
            .map((request) => populateRequest(request, userId, profileMap, skillsByUserMap));

        const received = requests
            .filter((request) => request.recipientId.toString() === userId.toString())
            .map((request) => populateRequest(request, userId, profileMap, skillsByUserMap));

        const allRequests = [...sent, ...received];
        const summary = {
            totalSent: sent.length,
            totalReceived: received.length,
            pending: allRequests.filter((request) => request.status === "pending" && !request.isExpired).length,
            accepted: allRequests.filter((request) => request.status === "accepted").length,
            rejected: allRequests.filter((request) => request.status === "rejected").length,
            expired: allRequests.filter((request) => request.status === "expired").length,
        };

        return res.status(200).json({
            success: true,
            message: "Exchange requests retrieved successfully.",
            data: {
                requests: {
                    sent,
                    received,
                    summary,
                },
            },
        });
    } catch (error) {
        console.error("getRequests error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to load exchange requests right now.",
            error: {},
        });
    }
};

const applyRequestStatus = async (req, res, nextStatus) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;
        const request = await ExchangeRequest.findById(requestId).lean();

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Exchange request not found.",
                error: {},
            });
        }

        if (request.recipientId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only respond to requests sent to you.",
                error: {},
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This request can no longer be updated.",
                error: {},
            });
        }

        const expirationAt = getExpirationAt(request);
        if (expirationAt.getTime() <= Date.now()) {
            await ExchangeRequest.findByIdAndUpdate(requestId, { $set: { status: "expired" } });
            return res.status(409).json({
                success: false,
                message: "This request expired before it could be answered.",
                error: {},
            });
        }

        const updatedRequest = await ExchangeRequest.findOneAndUpdate(
            { _id: requestId, recipientId: userId, status: "pending" },
            { $set: { status: nextStatus } },
            { new: true }
        ).lean();

        if (!updatedRequest) {
            return res.status(409).json({
                success: false,
                message: "This request is no longer pending.",
                error: {},
            });
        }

        return res.status(200).json({
            success: true,
            message: `Exchange request ${nextStatus} successfully.`,
            data: {
                request: {
                    id: updatedRequest._id.toString(),
                    status: updatedRequest.status,
                    senderId: updatedRequest.senderId.toString(),
                    recipientId: updatedRequest.recipientId.toString(),
                    createdAt: updatedRequest.createdAt,
                    updatedAt: updatedRequest.updatedAt,
                },
            },
        });
    } catch (error) {
        console.error("applyRequestStatus error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to update this exchange request.",
            error: {},
        });
    }
};

const acceptRequest = async (req, res) => applyRequestStatus(req, res, "accepted");
const rejectRequest = async (req, res) => applyRequestStatus(req, res, "rejected");

module.exports = {
    getRequests,
    acceptRequest,
    rejectRequest,
};
