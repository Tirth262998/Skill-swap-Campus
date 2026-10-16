const { validationResult } = require("express-validator");
const ExchangeRequest = require("../models/ExchangeRequest");
const Profile = require("../models/Profile");
const Skill = require("../models/Skill");
const User = require("../models/User");
const { calculateMatchScore, normalizeText } = require("../utils/matching");

const PUBLIC_PROFILE_FIELDS = [
    "_id",
    "userId",
    "name",
    "bio",
    "department",
    "year",
    "profileImage",
    "availability",
];

const publicProfile = (profile) => ({
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    name: profile.name,
    bio: profile.bio || null,
    department: profile.department,
    year: profile.year,
    profileImage: profile.profileImage || null,
    availability: profile.availability || null,
});

const publicSkills = (skills) =>
    skills.map((skill) => ({
        id: skill._id.toString(),
        name: skill.name,
        type: skill.type,
    }));

const validationError = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return false;

    res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || "Validation failed",
        error: { fields: errors.array() },
    });
    return true;
};

const getViewer = async (userId) => {
    const profile = await Profile.findOne({ userId }).select(PUBLIC_PROFILE_FIELDS).lean();
    if (!profile) return null;

    const skills = await Skill.find({ user: userId })
        .select("_id name type")
        .lean();
    return {
        profile: publicProfile(profile),
        skills: publicSkills(skills),
    };
};

const getDiscoverStudents = async (req, res) => {
    if (validationError(req, res)) return;

    try {
        const viewerId = req.user.id;
        const viewer = await getViewer(viewerId);
        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: "Create your profile before discovering students.",
                error: {},
            });
        }

        const search = queryText(req.query.search);
        const skill = queryText(req.query.skill);
        const searchTerm = normalizeText(search);
        const skillTerm = normalizeText(skill);
        const skillType = queryText(req.query.skillType);
        const department = queryText(req.query.department);
        const availability = queryText(req.query.availability);
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 12);
        const minimumScore = Number(queryText(req.query.minScore) || 0);
        const profileQuery = {
            userId: { $ne: viewerId },
        };

        if (department) {
            profileQuery.department = {
                $regex: `^${escapeRegex(department)}$`,
                $options: "i",
            };
        }
        if (availability) {
            profileQuery.availability = {
                $regex: `^${escapeRegex(availability)}$`,
                $options: "i",
            };
        }

        const profiles = await Profile.find(profileQuery)
            .select(PUBLIC_PROFILE_FIELDS)
            .lean();
        if (profiles.length === 0) {
            return sendStudentPage(res, [], page, limit);
        }

        const profileUserIds = profiles.map((profile) => profile.userId);
        const eligibleUsers = await User.find({
            _id: { $in: profileUserIds },
            profileCompleted: true,
        })
            .select("_id")
            .lean();
        const eligibleIds = new Set(eligibleUsers.map((user) => user._id.toString()));
        const eligibleProfiles = profiles.filter((profile) =>
            eligibleIds.has(profile.userId.toString())
        );
        if (eligibleProfiles.length === 0) {
            return sendStudentPage(res, [], page, limit);
        }

        const skillsByUser = new Map();
        const skills = await Skill.find({
            user: { $in: eligibleProfiles.map((profile) => profile.userId) },
        })
            .select("_id user name type")
            .lean();
        for (const skillRecord of skills) {
            const userId = skillRecord.user.toString();
            const studentSkills = skillsByUser.get(userId) || [];
            studentSkills.push({
                _id: skillRecord._id,
                name: skillRecord.name,
                type: skillRecord.type,
            });
            skillsByUser.set(userId, studentSkills);
        }

        const students = eligibleProfiles
            .map((profile) => {
                const userId = profile.userId.toString();
                const studentSkills = skillsByUser.get(userId) || [];
                return {
                    profile: publicProfile(profile),
                    skills: publicSkills(studentSkills),
                };
            })
            .filter((student) => {
                const candidateSkillType =
                    skillType === "learn" ? "teach" : skillType === "teach" ? "learn" : null;
                const nameMatches =
                    !searchTerm || normalizeText(student.profile.name).includes(searchTerm);
                const searchSkillMatches = !searchTerm || student.skills.some(
                    (candidateSkill) =>
                        (!candidateSkillType || candidateSkill.type === candidateSkillType) &&
                        normalizeText(candidateSkill.name).includes(searchTerm)
                );
                const separateSkillMatches = !skillTerm || student.skills.some(
                    (candidateSkill) =>
                        (!candidateSkillType || candidateSkill.type === candidateSkillType) &&
                        normalizeText(candidateSkill.name).includes(skillTerm)
                );
                return (nameMatches || searchSkillMatches) && separateSkillMatches;
            })
            .map((student) => ({
                ...student,
                rawScore: calculateMatchScore(viewer, student),
            }))
            .filter((student) => Math.round(student.rawScore) >= minimumScore)
            .sort((left, right) => {
                const scoreDifference = right.rawScore - left.rawScore;
                if (scoreDifference !== 0) return scoreDifference;

                const nameDifference = normalizeText(left.profile.name).localeCompare(
                    normalizeText(right.profile.name)
                );
                if (nameDifference !== 0) return nameDifference;
                return left.profile.userId.localeCompare(right.profile.userId);
            })
            .map(({ rawScore, ...student }) => ({
                ...student,
                matchScore: Math.round(rawScore),
            }));

        return sendStudentPage(res, students, page, limit);
    } catch (err) {
        console.error("getDiscoverStudents error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error fetching discoverable students",
            error: {},
        });
    }
};

const getStudent = async (req, res) => {
    if (validationError(req, res)) return;

    try {
        const viewer = await getViewer(req.user.id);
        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: "Create your profile before viewing student matches.",
                error: {},
            });
        }

        const profile = await Profile.findOne({ userId: req.params.userId })
            .select(PUBLIC_PROFILE_FIELDS)
            .lean();
        if (!profile) return studentNotFound(res);

        const eligibleUser = await User.findOne({
            _id: profile.userId,
            profileCompleted: true,
        })
            .select("_id")
            .lean();
        if (!eligibleUser) return studentNotFound(res);

        const studentSkills = await Skill.find({ user: profile.userId })
            .select("_id name type")
            .lean();
        const student = {
            profile: publicProfile(profile),
            skills: publicSkills(studentSkills),
        };
        student.matchScore = Math.round(calculateMatchScore(viewer, student));

        return res.status(200).json({
            success: true,
            message: "Student profile retrieved successfully",
            data: { student },
        });
    } catch (err) {
        console.error("getStudent error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error fetching student profile",
            error: {},
        });
    }
};

const createExchangeRequest = async (req, res) => {
    if (validationError(req, res)) return;

    try {
        const senderId = req.user.id;
        const { message } = req.body;
        const recipientId = req.body.recipientId.toLowerCase();
        const normalizedSenderId = senderId.toString().toLowerCase();
        if (normalizedSenderId === recipientId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send an exchange request to yourself.",
                error: {},
            });
        }

        const recipientProfile = await Profile.findOne({ userId: recipientId })
            .select("_id userId")
            .lean();
        if (!recipientProfile) return studentNotFound(res);

        const eligibleRecipient = await User.findOne({
            _id: recipientId,
            profileCompleted: true,
        })
            .select("_id")
            .lean();
        if (!eligibleRecipient) return studentNotFound(res);

        const [participantLow, participantHigh] =
            normalizedSenderId < recipientId
                ? [normalizedSenderId, recipientId]
                : [recipientId, normalizedSenderId];

        const existingPending = await ExchangeRequest.findOne({
            participantLow,
            participantHigh,
            status: "pending",
        })
            .select("_id")
            .lean();
        if (existingPending) return duplicateRequest(res);

        const exchangeRequest = await ExchangeRequest.create({
            senderId,
            recipientId,
            participantLow,
            participantHigh,
            message: typeof message === "string" && message.trim() ? message.trim() : undefined,
            status: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Exchange request sent successfully",
            data: {
                request: {
                    id: exchangeRequest._id.toString(),
                    senderId: exchangeRequest.senderId.toString(),
                    recipientId: exchangeRequest.recipientId.toString(),
                    message: exchangeRequest.message || null,
                    status: exchangeRequest.status,
                    createdAt: exchangeRequest.createdAt,
                },
            },
        });
    } catch (err) {
        if (err.code === 11000) return duplicateRequest(res);

        console.error("createExchangeRequest error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error sending exchange request",
            error: {},
        });
    }
};

const sendStudentPage = (res, students, page, limit) => {
    const total = students.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return res.status(200).json({
        success: true,
        message: "Discoverable students retrieved successfully",
        data: {
            students: students.slice(start, start + limit),
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1 && totalPages > 0,
            },
        },
    });
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const queryText = (value) => (typeof value === "string" ? value.trim() : "");

const studentNotFound = (res) =>
    res.status(404).json({
        success: false,
        message: "Student not found or not discoverable.",
        error: {},
    });

const duplicateRequest = (res) =>
    res.status(409).json({
        success: false,
        message: "A pending exchange request already exists between these students.",
        error: {},
    });

module.exports = { getDiscoverStudents, getStudent, createExchangeRequest };
