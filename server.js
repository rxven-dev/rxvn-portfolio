const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration rules
app.use(cors());
app.use(express.json()); // Parses incoming json form bodies

// 1. Configure the Mail Transport Channel
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your sender email account
        pass: process.env.EMAIL_PASS  // Your secure Google App Password
    }
});

// 2. The Contact Form API endpoint route handler
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validation guard clause
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: "All payload nodes are required." });
    }

    // Structure the message format as it will appear inside your Gmail inbox
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'ravenonlyacc@gmail.com', // Your destination email
        subject: `[PORTFOLIO MESSAGE] from ${name}`,
        replyTo: email, // Clicking "Reply" in your inbox automatically replies to the visitor
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #a855f7;">New Message Matrix Payload Received</h2>
                <p><strong>Sender Name:</strong> ${name}</p>
                <p><strong>Visitor Return Email:</strong> ${email}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                <p><strong>Message Data Stack:</strong></p>
                <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #a855f7; margin: 0;">
                    ${message.replace(/\n/g, '<br>')}
                </blockquote>
            </div>
        `
    };

    // Dispatch the payload through Google's transmission layers
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Transporter Exception: ", error);
            return res.status(500).json({ success: false, error: "System pipeline delivery failure." });
        }
        res.status(200).json({ success: true, message: "Payload securely routed to Gmail infrastructure." });
    });
});

app.listen(PORT, () => {
    console.log(`[SYSTEM RUNNING]: Node Core Engine humming perfectly on port ${PORT}`);
});