// Start server script
console.log("Starting index.js...");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
require("dotenv").config();

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("FATAL ERROR: Missing OPENAI_API_KEY in environment variables.");
  console.error("Ensure the .env file exists and is correctly configured.");
  process.exit(1);
}

console.log("Dependencies loaded...");

// Initialize express app
const app = express();

// Middleware setup
console.log("Middleware setup starting...");
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:4000", // Local environment
      "https://learninizer.vercel.app", // Deployed environment
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.static(path.join(__dirname, "public")));
console.log("Middleware setup complete...");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Uploads directory created at ${uploadsDir}`);
}

// Configure Multer for file uploads
const upload = multer({ dest: uploadsDir });

// Root route for the app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Extract text from uploaded files
app.post("/extract-text", upload.single("file"), async (req, res) => {
  console.log("Received request for /extract-text...");
  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = req.file.path;
  const fileType = req.file.mimetype;

  try {
    if (fileType === "application/pdf") {
      console.log("Processing PDF...");
      const outputDir = path.join(uploadsDir, "pdf-images");
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const pngFiles = await convertPdfToImages(filePath, outputDir);

      let extractedText = "";
      for (const imageFile of pngFiles) {
        const {
          data: { text },
        } = await Tesseract.recognize(imageFile, "eng");
        extractedText += `${text}\n`;
        fs.unlinkSync(imageFile);
      }

      console.log("OCR completed successfully...");
      res.status(200).json({ extractedText });
    } else if (fileType.startsWith("image/")) {
      console.log("Processing image...");
      const {
        data: { text },
      } = await Tesseract.recognize(filePath, "eng");
      console.log("OCR completed successfully...");
      res.status(200).json({ extractedText: text });
    } else {
      console.error("Unsupported file type.");
      res.status(400).json({ error: "Unsupported file type." });
    }
  } catch (error) {
    console.error("Error during file processing:", error.message);
    res.status(500).json({ error: "Failed to process the file." });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete file:", err.message);
    });
  }
});

// Generate text using OpenAI API
app.post("/generate-text", async (req, res) => {
  console.log("Received request for /generate-text...");
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
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.status(200).json({ generatedText: response.data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate text." });
  }
});

// Generate image using OpenAI API
app.post("/generate-image", async (req, res) => {
  console.log("Received request for /generate-image...");
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      { prompt, n: 1, size: "512x512" },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.status(200).json({ imageUrl: response.data.data[0].url });
  } catch (error) {
    console.error("Image generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

// Serve all other requests to the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Export for Vercel
module.exports = app;

// Start server locally if not in Vercel
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running locally at http://localhost:${port}`);
  });
};
