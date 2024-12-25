// server.js
const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// Initialize express
const app = express();
app.use(cors());
app.use(express.json());

// 1) Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// 2) Endpoint to generate a signature
app.post("/get-signature", (req, res) => {
  try {
    // We'll receive some parameters from the client:
    // e.g. { folder, public_id, timestamp }
    const { folder, public_id, timestamp } = req.body;

    // We must sign all these parameters (except file).
    // If the client wants to specify more Cloudinary parameters
    // (like transformations), they must also be included here.
    const paramsToSign = {
      folder: folder,
      public_id: public_id,
      timestamp: timestamp,
    };

    // Generate a signature using Cloudinary's utility
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret
    );

    // Return signature and relevant info
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

// 3) Start server on port 5000 (or any)
app.listen(5000, () => {
  console.log("Server listening on http://localhost:5000");
});
