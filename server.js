const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Initialize express
const app = express();

// Use CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Global error handlers for better debugging
process.on("uncaughtException", (err) => {
  console.error("Unhandled Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Log Cloudinary configuration to verify variables
console.log("Cloudinary Config:");
console.log("Cloudinary API Key:", cloudinary.config().api_key);
console.log("Cloudinary Cloud Name:", cloudinary.config().cloud_name);

// Test Route to verify server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Endpoint to generate a Cloudinary signature
app.post("/get-signature", (req, res) => {
  try {
    const { folder, public_id, timestamp } = req.body;

    // Check if all required parameters are provided
    if (!folder || !public_id || !timestamp) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    // Create the parameters to sign
    const paramsToSign = {
      folder: folder,
      public_id: public_id,
      timestamp: timestamp,
    };

    // Generate the signature using Cloudinary's API
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret
    );

    // Respond with the signature, API key, and Cloudinary cloud name
    res.json({
      signature: signature,
      apiKey: cloudinary.config().api_key,
      cloudName: cloudinary.config().cloud_name,
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ error: "Server error generating signature." });
  }
});

// Define the port and ensure it uses Railway's PORT variable
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
