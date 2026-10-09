const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Skill name is required"],
            trim: true,
            minlength: [2, "Skill name must be at least 2 characters"],
            maxlength: [50, "Skill name must be 50 characters or fewer"],
        },
        type: {
            type: String,
            required: [true, "Skill type is required"],
            enum: {
                values: ["teach", "learn"],
                message: "Skill type must be 'teach' or 'learn'",
            },
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate skills for the same user of the same type
skillSchema.index({ user: 1, name: 1, type: 1 }, { unique: true });

// Discovery and matching index for Module 3
skillSchema.index({ type: 1, name: 1 });

module.exports = mongoose.model("Skill", skillSchema);
