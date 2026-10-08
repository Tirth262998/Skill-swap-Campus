const express = require("express");
const { body } = require("express-validator");
const { register, login, logout, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();



const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[a-zA-Z]/)
        .withMessage("Password must contain at least one letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

    body("year")
        .notEmpty()
        .withMessage("Year is required")
        .isInt({ min: 1, max: 6 })
        .withMessage("Year must be a number between 1 and 6"),
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];




router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

router.post("/logout", protect, logout);
router.get("/me", protect, me);

module.exports = router;
