const express = require("express");
const router = express.Router();
const Connect = require("../models/Connect");

// @route   POST /api/connect
// @desc    Submit a request
// @access  Public
router.post("/", async (req, res) => {
    try {
        const { name, number, email, message } = req.body;

        if (!name || !number || !email || !message) {
            return res.status(400).json({ error: "Please provide all fields" });
        }

        const newConnect = new Connect({
            name,
            number,
            email,
            message,
        });

        await newConnect.save();

        res.status(201).json({ message: "Request submitted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   GET /api/connect
// @desc    Get all requests (Admin)
// @access  Public (as per requirement "admin can get the list", currently no auth middleware applied here but can be added)
router.get("/", async (req, res) => {
    try {
        const requests = await Connect.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
