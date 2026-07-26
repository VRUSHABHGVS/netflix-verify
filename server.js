const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// For demo purposes, we store the OTP in a variable. 
// In a real app, use Redis or a database with an expiration time.
let currentOTP = "123456"; 

// Endpoint to verify the OTP
app.post('/verify', (req, res) => {
    const { otp } = req.body;
    
    if (otp === currentOTP) {
        return res.json({ success: true, message: "Verified!" });
    } else {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
});

// Endpoint to generate/resend OTP
app.post('/resend', (req, res) => {
    currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`New OTP generated: ${currentOTP}`); // In production, send this via Email/SMS
    res.json({ success: true, message: "New OTP sent." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.listen(3000, () => console.log('Server running on http://localhost:3000'));