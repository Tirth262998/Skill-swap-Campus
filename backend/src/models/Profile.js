const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, 
        },

        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        bio: {
            type: String,
            trim: true,
        },

        department: {
            type: String,
            required: [true, "Department is required"],
            trim: true,
        },

        year: {
            type: Number,
            required: [true, "Year is required"],
        },

        profileImage: {
            type: String,
            trim: true,
        },

        interests: {
            type: [String],
            default: [],
        },

        availability: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("Profile", profileSchema);
