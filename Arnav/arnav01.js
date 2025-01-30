const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const twilio = require("twilio");
require("dotenv").config(); // Load environment variables from .env file

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Sample data of registered cars (replace with your database later)
const registeredCars = {
    "ABC-1234": "+919354431461", // Replace with actual phone numbers
};

// API route to handle form submissions
app.post("/submit", upload.single("image"), (req, res) => {
    const numberPlate = req.body.number_plate;

    if (registeredCars[numberPlate]) {
        const phoneNumber = registeredCars[numberPlate];

        // Send SMS using Twilio
        client.messages
            .create({
                body: `Your car with number plate ${numberPlate} is parked incorrectly. Please move it immediately.`,
                from: "+18454098871", // Replace with your Twilio phone number
                to: phoneNumber,
            })
            .then((message) => {
                console.log("Message sent: ", message.sid);
                res.send("SMS alert sent successfully!");
            })
            .catch((err) => {
                console.error("Error sending SMS: ", err);
                res.status(500).send("Failed to send SMS.");
            });
    } else {
        res.status(404).send("Number plate not found in the database.");
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
