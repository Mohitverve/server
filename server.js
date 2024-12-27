require("dotenv").config();

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

console.log("Cloudinary Config:");
console.log("Cloudinary API Key:", cloudinary.config().api_key);
console.log("Cloudinary Cloud Name:", cloudinary.config().cloud_name);

// Define routes (as per your code)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/get-signature", (req, res) => {
  try {
    console.log("Request body:", req.body); // Add logging for debugging

    const { folder, public_id, timestamp } = req.body;

    if (!folder || !public_id || !timestamp) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const paramsToSign = { folder, public_id, timestamp };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret
    );

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


const PORT = process.env.PORT || 8080; // Default to 8080 if PORT is not set
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
