const { validationResult } = require("express-validator");
const Profile = require("../models/Profile");
const User = require("../models/User");


const safeProfile = (profile) => ({
    id: profile._id,
    userId: profile.userId,
    name: profile.name,
    bio: profile.bio || null,
    department: profile.department,
    year: profile.year,
    profileImage: profile.profileImage || null,
    interests: profile.interests,
    availability: profile.availability || null,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
});


const syncUserFields = async (userId, fields) => {
    const update = {};
    if (fields.name !== undefined)       update.name       = fields.name;
    if (fields.department !== undefined) update.department = fields.department;
    if (fields.year !== undefined)       update.year       = fields.year;

    if (Object.keys(update).length > 0) {
        await User.findByIdAndUpdate(userId, update, { runValidators: false });
    }
};


const createProfile = async (req, res) => {
    // 1. Validate incoming fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: { fields: errors.array() },
        });
    }

    try {

        const authenticatedId = req.user.id;

        
        const existing = await Profile.findOne({ userId: authenticatedId });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "A profile already exists for this account",
                error: {},
            });
        }

        const {
            name,
            bio,
            department,
            year,
            profileImage,
            interests,
            availability,
        } = req.body;

        
        const profile = await Profile.create({
            userId: authenticatedId,
            name: name.trim(),
            bio: bio ? bio.trim() : undefined,
            department: department.trim(),
            year: Number(year),
            profileImage: profileImage ? profileImage.trim() : undefined,
            interests: Array.isArray(interests)
                ? interests.map((i) => i.trim()).filter(Boolean)
                : [],
            availability: availability ? availability.trim() : undefined,
        });

        
        await syncUserFields(authenticatedId, {
            name: profile.name,
            department: profile.department,
            year: profile.year,
        });

        await User.findByIdAndUpdate(authenticatedId, { profileCompleted: true });

        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: { profile: safeProfile(profile) },
        });
    } catch (err) {
        console.error("createProfile error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error creating profile",
            error: {},
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found. Please create your profile first.",
                error: {},
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: { profile: safeProfile(profile) },
        });
    } catch (err) {
        console.error("getProfile error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error fetching profile",
            error: {},
        });
    }
};

const updateProfile = async (req, res) => {
    // 1. Validate incoming fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: { fields: errors.array() },
        });
    }

    try {
        
        const authenticatedId = req.user.id;

        const existingProfile = await Profile.findOne({ userId: authenticatedId });
        if (!existingProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found. Please create your profile first.",
                error: {},
            });
        }

        const {
            name,
            bio,
            department,
            year,
            profileImage,
            interests,
            availability,
        } = req.body;

        const updateFields = {};
        if (name !== undefined)       updateFields.name  = name.trim();
        if (bio !== undefined)          updateFields.bio   = bio.trim();
        if (department !== undefined)   updateFields.department   = department.trim();
        if (year !== undefined)         updateFields.year    = Number(year);
        if (profileImage !== undefined) updateFields.profileImage = profileImage.trim();
        if (interests !== undefined) {
            updateFields.interests = Array.isArray(interests)
                ? interests.map((i) => i.trim()).filter(Boolean)
                : [];
        }
        if (availability !== undefined) updateFields.availability = availability.trim();

        
        const updatedProfile = await Profile.findOneAndUpdate(
            { userId: authenticatedId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        
        await syncUserFields(authenticatedId, {
            name: updateFields.name,
            department: updateFields.department,
            year: updateFields.year,
        });

        await User.findByIdAndUpdate(authenticatedId, { profileCompleted: true });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: { profile: safeProfile(updatedProfile) },
        });
    } catch (err) {
        console.error("updateProfile error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error updating profile",
            error: {},
        });
    }
};

module.exports = { createProfile, getProfile, updateProfile };
