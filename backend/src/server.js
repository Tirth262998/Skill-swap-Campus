require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const skillRoutes = require("./routes/skillRoutes");
const discoverRoutes = require("./routes/discoverRoutes");
const requestRoutes = require("./routes/requestRoutes");
const ExchangeRequest = require("./models/ExchangeRequest");

const app = express();

connectDB();

const expirePendingRequests = async () => {
    try {
        const result = await ExchangeRequest.updateMany(
            {
                status: "pending",
                $or: [
                    { expirationAt: { $lte: new Date() } },
                    { expirationAt: { $exists: false } },
                ],
            },
            { $set: { status: "expired" } }
        );

        if (result.modifiedCount > 0 || result.matchedCount > 0) {
            console.log(`Expired ${result.modifiedCount} pending request(s).`);
        }
    } catch (error) {
        console.error("Failed to expire pending requests:", error.message);
    }
};

const startRequestExpirationJob = () => {
    expirePendingRequests();
    setInterval(expirePendingRequests, 60 * 1000);
};

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "SkillSwap backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api", requestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startRequestExpirationJob();
});