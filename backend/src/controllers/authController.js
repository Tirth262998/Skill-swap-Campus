const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");


const cookieOptions = {
    httpOnly: true,                              
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",                            
    maxAge: 7 * 24 * 60 * 60 * 1000,            // 7 days in ms
};


const generateToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    department: user.department,
    year: user.year,
    profileCompleted: user.profileCompleted,
});


const register = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: { fields: errors.array() },
        });
    }

    const { name, email, password, department, year } = req.body;

    const normalizedEmail = (email || "").toLowerCase().trim();
    if (!normalizedEmail.endsWith("@student.nitw.ac.in")) {
        return res.status(400).json({
            success: false,
            message: "Only NIT Warangal student email addresses are allowed.",
            error: {},
        });
    }

    try {
       
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
                error: {},
            });
        }

       
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            department: department.trim(),
            year: Number(year),
        });

       
        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);

      
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: { user: safeUser(user) },
        });
    } catch (err) {
        console.error("Register error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: {},
        });
    }
};


const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: { fields: errors.array() },
        });
    }

    const { email, password } = req.body;

    try {
       
        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                error: {},
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
                error: {},
            });
        }

       
        const token = generateToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user: safeUser(user) },
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: {},
        });
    }
};

const logout = (req, res) => {

    res.cookie("token", "", {
        ...cookieOptions,
        maxAge: 0,
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful",
        data: {},
    });
};


const me = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: {},
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: { user: safeUser(user) },
        });
    } catch (err) {
        console.error("Me error:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error fetching user",
            error: {},
        });
    }
};

module.exports = { register, login, logout, me };
