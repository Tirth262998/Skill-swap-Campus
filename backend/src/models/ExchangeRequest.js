const mongoose = require("mongoose");

const REQUEST_EXPIRY_DAYS = 10;

const exchangeRequestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participantLow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        participantHigh: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            trim: true,
            maxlength: [500, "Message must be 500 characters or fewer"],
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "expired"],
            default: "pending",
            required: true,
        },
        expirationAt: {
            type: Date,
            required: false,
        },
    },
    { timestamps: true }
);

exchangeRequestSchema.pre("save", function setExpirationDate() {
    if (!this.expirationAt && this.status === "pending") {
        const created = this.createdAt || new Date();
        this.expirationAt = new Date(created.getTime() + REQUEST_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    }
});

exchangeRequestSchema.index(
    { participantLow: 1, participantHigh: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "pending" },
    }
);

exchangeRequestSchema.index({ status: 1, expirationAt: 1 });

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);
