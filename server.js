const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (Replace <password> and the string with yours)
const mongoURI = "mongodb+srv://admin:<password>@cluster0.mongodb.net/netflixDB?retryWrites=true&w=majority";
mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("DB Connection Error:", err));

// 2. Create a Schema (The structure of your data)
const otpSchema = new mongoose.Schema({
    email: String,
    code: String,
    createdAt: { type: Date, default: Date.now, expires: 300 } // Automatically deletes after 5 mins (300 seconds)
});

const OTP = mongoose.model('OTP', otpSchema);

// 3. Endpoint to Generate and Save OTP
app.post('/resend', async (req, res) => {
    const userEmail = "user@example.com"; // In a real app, get this from req.body
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Delete any old OTPs for this email first
        await OTP.deleteMany({ email: userEmail });

        // Save new OTP to Database
        const newOTP = new OTP({ email: userEmail, code: generatedCode });
        await newOTP.save();

        console.log(`OTP for ${userEmail}: ${generatedCode}`); // In production, send via Email
        res.json({ success: true, message: "OTP sent to database." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 4. Endpoint to Verify OTP from Database
app.post('/verify', async (req, res) => {
    const { otp } = req.body;
    const userEmail = "user@example.com";

    try {
        const record = await OTP.findOne({ email: userEmail, code: otp });

        if (record) {
            // Success! Delete the OTP so it can't be used again
            await OTP.deleteOne({ _id: record._id });
            res.json({ success: true, message: "Verified successfully!" });
        } else {
            res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Verification Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
