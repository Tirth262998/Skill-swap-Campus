const express = require("express");
const { body, param } = require("express-validator");
const { protect } = require("../middleware/auth");
const {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
} = require("../controllers/skillController");

const router = express.Router();

const createSkillValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Skill name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Skill name must be between 2 and 50 characters"),

    body("type")
        .trim()
        .notEmpty()
        .withMessage("Skill type is required")
        .isIn(["teach", "learn"])
        .withMessage("Skill type must be 'teach' or 'learn'"),
];

const updateSkillValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid skill ID"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Skill name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Skill name must be between 2 and 50 characters"),

    body("type")
        .optional()
        .trim()
        .isIn(["teach", "learn"])
        .withMessage("Skill type must be 'teach' or 'learn'"),
];

const deleteSkillValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid skill ID"),
];

router.get("/", protect, getSkills);
router.post("/", protect, createSkillValidation, createSkill);
router.put("/:id", protect, updateSkillValidation, updateSkill);
router.delete("/:id", protect, deleteSkillValidation, deleteSkill);

module.exports = router;
