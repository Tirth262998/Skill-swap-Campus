const express = require("express");
const { param, body } = require("express-validator");
const { protect } = require("../middleware/auth");
const { getRequests, acceptRequest, rejectRequest } = require("../controllers/requestController");

const router = express.Router();

router.get("/requests", protect, getRequests);
router.get("/discover/requests", protect, getRequests);

router.post(
    "/requests/:requestId/accept",
    protect,
    param("requestId").isMongoId().withMessage("Invalid request ID"),
    acceptRequest
);

router.post(
    "/requests/:requestId/reject",
    protect,
    param("requestId").isMongoId().withMessage("Invalid request ID"),
    rejectRequest
);

router.patch(
    "/requests/:requestId",
    protect,
    param("requestId").isMongoId().withMessage("Invalid request ID"),
    body("status").isIn(["accepted", "rejected"]).withMessage("Status must be accepted or rejected"),
    async (req, res) => {
        if (req.body.status === "accepted") return acceptRequest(req, res);
        return rejectRequest(req, res);
    }
);

module.exports = router;
