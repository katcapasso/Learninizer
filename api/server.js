// Start server script
console.log("Starting server.js...");

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");
const pdf2png = require("pdf-poppler"); // Install with `npm install pdf-poppler`
require("dotenv").config();

// Check if essential environment variables are defined
if (!process.env.OPENAI_API_KEY) {
  console.error("FATAL ERROR: Missing OPENAI_API_KEY in environment variables.");
  process.exit(1); // Exit the process if critical config is missing
}

console.log("Dependencies loaded...");

// Initialize express
const app = express();

console.log("Middleware setup starting...");

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:4000",
      "https://learninizer.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Serve static files from the 'public' directory inside the `api` folder
app.use(express.static(path.join(__dirname, "public")));

console.log("Middleware setup complete...");

// Configure uploads directory (inside the `api/uploads` folder for clarity)
const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  console.log(`Uploads directory not found at ${uploadsDir}. Creating...`);
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Uploads directory created successfully at ${uploadsDir}.`);
  } catch (error) {
    console.error(`Failed to create uploads directory at ${uploadsDir}:`, error);
    process.exit(1);
  }
}

// Configure Multer for file uploads
const upload = multer({ dest: uploadsDir });
console.log("Multer configured...");

// Root Route (to verify the server is running)
app.get("/api", (req, res) => {
  res.status(200).send("API is running. Endpoints are ready.");
});

// Route to extract text from uploaded files
app.post("/api/extract-text", upload.single("file"), async (req, res) => {
  console.log("Received request for /api/extract-text...");
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
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const options = {
        format: "png",
        out_dir: outputDir,
        out_prefix: "page",
        page: null,
      };

      await pdf2png.convert(filePath, options);
      console.log("PDF converted to images...");

      const pngFiles = fs
        .readdirSync(outputDir)
        .filter((file) => file.endsWith(".png"))
        .map((file) => path.join(outputDir, file));

      let extractedText = "";
      for (const imageFile of pngFiles) {
        const { data: { text } } = await Tesseract.recognize(imageFile, "eng");
        extractedText += `${text}\n`;
        fs.unlinkSync(imageFile);
      }
      console.log("OCR completed successfully...");
      res.status(200).json({ extractedText });
    } else if (fileType.startsWith("image/")) {
      console.log("Processing image...");
      const { data: { text } } = await Tesseract.recognize(filePath, "eng");
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
      else console.log("Temporary file deleted successfully.");
    });
  }
});

// Route to generate text using OpenAI API
app.post("/api/generate-text", async (req, res) => {
  console.log("Received request for /api/generate-text...");
  const { prompt } = req.body;

  if (!prompt) {
    console.error("No prompt provided.");
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      }
    );
    console.log("Text generation completed successfully...");
    res.status(200).json({ generatedText: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Text generation failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate text." });
  }
});

// Route to generate an image using OpenAI API
app.post("/api/generate-image", async (req, res) => {
  console.log("Received request for /api/generate-image...");
  const { prompt } = req.body;

  if (!prompt) {
    console.error("No prompt provided.");
    return res.status(400).json({ error: "No prompt provided." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "512x512",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      }
    );
    console.log("Image generation completed successfully...");
    res.status(200).json({ imageUrl: response.data.data[0].url });
  } catch (error) {
    console.error("Image generation failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

// Serve static files and fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Export for Vercel deployment
module.exports = app;

// Start the server locally if not in Vercel
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server is running locally at http://localhost:${port}`);
  });
}
