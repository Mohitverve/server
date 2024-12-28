require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const morgan = require("morgan"); // For logging

// Initialize express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Logging middleware
app.use(morgan('combined'));

// CORS Configuration
app.use(
  cors({
    origin: "https://date-planner-lyart.vercel.app", // Allow requests from your frontend
    methods: ["GET", "POST", "OPTIONS"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // If you need to send cookies or auth headers
  })
);

// Middleware to handle preflight requests
app.options("*", cors());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:");
console.log("Cloudinary API Key:", cloudinary.config().api_key);
console.log("Cloudinary Cloud Name:", cloudinary.config().cloud_name);

// Test route to verify server is running
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ status: "success", message: "Server is running on Railway!" });
});

// Endpoint to generate a Cloudinary signature
app.post("/get-signature", (req, res) => {
  console.log("Incoming request to /get-signature");
  try {
    const { folder, public_id, timestamp } = req.body;

    if (!folder || !public_id || !timestamp) {
      console.log("Missing parameters in /get-signature request:", req.body);
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const paramsToSign = { folder, public_id, timestamp };
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret
    );

    console.log("Signature generated:", signature);

    res.json({
      signature: signature,
      apiKey: cloudinary.config().api_key,
      cloudName: cloudinary.config().cloud_name,
    });
  } catch (error) {
    console.error("Error in /get-signature:", error);
    res.status(500).json({ error: "Server error generating signature." });
  }
});

// Port configuration
const PORT = process.env.PORT || 8080;
console.log("Port used by the server:", PORT);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
