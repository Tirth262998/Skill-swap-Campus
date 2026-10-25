const express = require("express");
const { body, param, query } = require("express-validator");
const { protect } = require("../middleware/auth");
const {
    getDiscoverStudents,
    getStudent,
    createExchangeRequest,
} = require("../controllers/discoverController");

const router = express.Router();

const directoryValidation = [
    query("search").optional().isString().trim().isLength({ max: 100 }),
    query("skill").optional().isString().trim().isLength({ max: 50 }),
    query("skillType")
        .optional()
        .trim()
        .isIn(["teach", "learn"])
        .withMessage("skillType must be 'teach' or 'learn'"),
    query("department").optional().isString().trim().isLength({ max: 100 }),
    query("availability").optional().isString().trim().isLength({ max: 100 }),
    query("page").optional().trim().isInt({ min: 1 }).withMessage("page must be a positive integer"),
    query("limit")
        .optional()
        .trim()
        .isInt({ min: 1, max: 50 })
        .withMessage("limit must be between 1 and 50"),
    query("minScore")
        .optional()
        .trim()
        .isFloat({ min: 0, max: 100 })
        .withMessage("minScore must be between 0 and 100"),
];

router.get("/students", protect, directoryValidation, getDiscoverStudents);
router.get(
    "/students/:userId",
    protect,
    param("userId").isMongoId().withMessage("Invalid student ID"),
    getStudent
);
router.post(
    "/exchange-requests",
    protect,
    body("recipientId").isMongoId().withMessage("Invalid recipient ID"),
    body("message")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Message must be 500 characters or fewer"),
    createExchangeRequest
);

module.exports = router;



