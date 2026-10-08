const express = require("express");
const { body } = require("express-validator");
const { createProfile, getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/auth");

const router = express.Router();

const optionalFieldValidators = [
    body("bio")
        .optional()
        .isString()
        .withMessage("Bio must be a string")
        .trim(),

    body("profileImage")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),

    body("interests")
        .optional()
        .isArray()
        .withMessage("Interests must be an array"),

    body("interests.*")
        .optional()
        .isString()
        .withMessage("Each interest must be a string")
        .trim()
        .notEmpty()
        .withMessage("Each interest must be a non-empty string"),

    body("availability")
        .optional()
        .isString()
        .withMessage("Availability must be a string")
        .trim(),
];

const createValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required")
        .isString()
        .withMessage("Department must be a string"),

    body("year")
        .notEmpty()
        .withMessage("Year is required")
        .isInt({ min: 1, max: 6 })
        .withMessage("Year must be a number between 1 and 6"),

    ...optionalFieldValidators,
];

const updateValidation = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isString()
        .withMessage("Name must be a string"),

    body("department")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Department cannot be empty")
        .isString()
        .withMessage("Department must be a string"),

    body("year")
        .optional()
        .isInt({ min: 1, max: 6 })
        .withMessage("Year must be a number between 1 and 6"),

    ...optionalFieldValidators,
];


router.post("/", protect, createValidation, createProfile);
router.get("/", protect, getProfile);
router.put("/", protect, updateValidation, updateProfile);

module.exports = router;
