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
    const { folder, public_id, timestamp } = req.body;

    const paramsToSign = {
      folder: folder,
      public_id: public_id,
      timestamp: timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret
    );

    res.json({
      signature: signature,
      apiKey: cloudinary.config().api_key, // Include your Cloudinary API Key
      cloudName: cloudinary.config().cloud_name, // Include your Cloudinary Cloud Name
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ error: "Server error generating signature." });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});