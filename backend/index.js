// Start server script
console.log("Starting index.js...");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("FATAL ERROR: Missing OPENAI_API_KEY in environment variables.");
  process.exit(1);
}

// Initialize express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local React app
      "https://learninizer.vercel.app", // Deployed React app
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Configure Multer for file uploads
const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only PDF, JPG, and PNG are allowed."));
    }
  },
});

// API Endpoints
app.get("/api", (req, res) => {
  res.json({ message: "API is running. Endpoints are ready." });
});

// POST Endpoint to Extract Text
app.post("/api/extract-text", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = req.file.path;
  const fileType = req.file.mimetype;

  try {
    if (fileType === "application/pdf") {
      const extractedText = await processPdf(filePath);
      res.status(200).json({ extractedText });
    } else if (fileType.startsWith("image/")) {
      const { data } = await Tesseract.recognize(filePath, "eng");
      res.status(200).json({ extractedText: data.text });
    } else {
      res.status(400).json({ error: "Unsupported file type." });
    }
  } catch (error) {
    console.error("File processing error:", error.message);
    res.status(500).json({ error: "Failed to process the file." });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err.message);
    });
  }
});

// POST Endpoint to Generate Text
app.post("/api/generate-text", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    res.status(200).json({ generatedText: response.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate text." });
  }
});

// POST Endpoint to Generate Image
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      { prompt, n: 1, size: "512x512" },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    res.status(200).json({ imageUrl: response.data.data[0].url });
  } catch (error) {
    console.error("Image generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

// Export for Vercel
module.exports = app;

// Start server locally if not in Vercel
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running locally at http://localhost:${port}`);
  });
}

// Helper function for PDF processing
async function processPdf(filePath) {
  // Add logic to process PDFs into images and extract text
  return "Text extracted from PDF (mocked)."; // Placeholder
}
