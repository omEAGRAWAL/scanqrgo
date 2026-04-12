const express = require("express");
const router = express.Router();
const Connect = require("../models/Connect");
const nodemailer = require("nodemailer");

// Reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// @route   POST /api/connect
// @desc    Submit a request + notify via email
// @access  Public
router.post("/", async (req, res) => {
    try {
        const { name, number, email, message } = req.body;

        if (!name || !number || !email || !message) {
            return res.status(400).json({ error: "Please provide all fields" });
        }

        const newConnect = new Connect({ name, number, email, message });
        await newConnect.save();

        // Respond immediately — don't wait for email
        res.status(201).json({ message: "Request submitted successfully" });

        // Send email notification async (non-blocking)
        transporter.sendMail({
            from: `"Reviu Leads" <${process.env.EMAIL_USER}>`,
            to: "storereviu@gmail.com",
            subject: `New Lead: ${name} — ${message}`,
            html: `
                <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
                    <div style="background:#232F3E;padding:24px 32px;">
                        <h2 style="color:#FF9900;margin:0;font-size:22px;">New Reviu Lead</h2>
                        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px;">Submitted via reviu.store contact form</p>
                    </div>
                    <div style="padding:28px 32px;">
                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                            <tr>
                                <td style="padding:10px 0;color:#888;width:120px;vertical-align:top;font-weight:600;">Name</td>
                                <td style="padding:10px 0;color:#0F1111;font-weight:500;">${name}</td>
                            </tr>
                            <tr style="border-top:1px solid #f0f0f0;">
                                <td style="padding:10px 0;color:#888;font-weight:600;">Email</td>
                                <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#146EB4;text-decoration:none;">${email}</a></td>
                            </tr>
                            <tr style="border-top:1px solid #f0f0f0;">
                                <td style="padding:10px 0;color:#888;font-weight:600;">WhatsApp</td>
                                <td style="padding:10px 0;"><a href="https://wa.me/${number.replace(/\D/g,'')}" style="color:#1AAD72;text-decoration:none;">${number}</a></td>
                            </tr>
                            <tr style="border-top:1px solid #f0f0f0;">
                                <td style="padding:10px 0;color:#888;font-weight:600;vertical-align:top;">Business</td>
                                <td style="padding:10px 0;color:#0F1111;">${message}</td>
                            </tr>
                        </table>
                        <div style="margin-top:24px;padding:16px;background:#FFF8EC;border-left:4px solid #FF9900;border-radius:4px;font-size:13px;color:#555;">
                            Reply to this email or WhatsApp them to follow up.
                        </div>
                    </div>
                    <div style="background:#f7f8f8;padding:14px 32px;font-size:11px;color:#aaa;text-align:center;">
                        Reviu.store &bull; Lead notification &bull; ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                    </div>
                </div>
            `,
        }).catch((err) => console.error("Lead email failed:", err));

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// @route   GET /api/connect
// @desc    Get all requests (Admin)
// @access  Public
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
