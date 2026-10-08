const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in.",
            error: {},
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again.",
            error: {},
        });
    }
};

module.exports = { protect };
