const mongoose = require("mongoose");

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
            enum: ["pending"],
            default: "pending",
            required: true,
        },
    },
    { timestamps: true }
);

exchangeRequestSchema.index(
    { participantLow: 1, participantHigh: 1 },
    {
        unique: true,
        partialFilterExpression: { status: "pending" },
    }
);

module.exports = mongoose.model("ExchangeRequest", exchangeRequestSchema);
