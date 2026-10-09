const { validationResult } = require("express-validator");
const Skill = require("../models/Skill");

const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getSkills = async (req, res) => {
    try {
        const userId = req.user.id;
        const skills = await Skill.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Skills retrieved successfully",
            data: { skills },
        });
    } catch (err) {
        console.error("getSkills error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error fetching skills",
            error: {},
        });
    }
};

const createSkill = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0]?.msg || "Validation failed",
            error: { fields: errors.array() },
        });
    }

    try {
        const userId = req.user.id;
        const { name, type } = req.body;
        const trimmedName = name.trim();
        const trimmedType = type.trim();


        const existingSkill = await Skill.findOne({
            user: userId,
            type: trimmedType,
            name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, "i") },
        });

        if (existingSkill) {
            return res.status(409).json({
                success: false,
                message: "You already have this skill listed",
                error: {},
            });
        }

        const skill = await Skill.create({
            name: trimmedName,
            type: trimmedType,
            user: userId,
        });

        return res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: { skill },
        });
    } catch (err) {

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You already have this skill listed",
                error: {},
            });
        }

        console.error("createSkill error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error creating skill",
            error: {},
        });
    }
};

const updateSkill = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0]?.msg || "Validation failed",
            error: { fields: errors.array() },
        });
    }

    try {
        const userId = req.user.id;
        const skillId = req.params.id;
        const { name } = req.body;
        const trimmedName = name.trim();

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
                error: {},
            });
        }

        if (skill.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to modify this skill",
                error: {},
            });
        }

        if (trimmedName.toLowerCase() !== skill.name.toLowerCase()) {
            const duplicate = await Skill.findOne({
                _id: { $ne: skill._id },
                user: userId,
                type: skill.type,
                name: { $regex: new RegExp(`^${escapeRegex(trimmedName)}$`, "i") },
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "You already have this skill listed",
                    error: {},
                });
            }
        }

        skill.name = trimmedName;
        await skill.save();

        return res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            data: { skill },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "You already have this skill listed",
                error: {},
            });
        }

        console.error("updateSkill error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error updating skill",
            error: {},
        });
    }
};

const deleteSkill = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0]?.msg || "Invalid skill ID",
            error: { fields: errors.array() },
        });
    }

    try {
        const userId = req.user.id;
        const skillId = req.params.id;

        const skill = await Skill.findById(skillId);
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
                error: {},
            });
        }

        if (skill.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this skill",
                error: {},
            });
        }

        await skill.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
            data: {},
        });
    } catch (err) {
        console.error("deleteSkill error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error deleting skill",
            error: {},
        });
    }
};

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
};
