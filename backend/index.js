const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// CORS setup to allow both local development and production
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? "https://learninizer.vercel.app" // Production URL
  : "http://localhost:3000"; // Local URL for development

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Configure Multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
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

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Learninizer API!");
});

// Test Endpoint to check backend connection
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

// POST Endpoint to Extract Text
app.post("/api/extract-text", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const { buffer, mimetype } = req.file;

  try {
    let extractedText = "";

    if (mimetype === "application/pdf") {
      extractedText = await processPdf(buffer);
    } else if (mimetype.startsWith("image/")) {
      const { data } = await Tesseract.recognize(buffer, "eng");
      extractedText = data.text;
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    // Save extracted text to Supabase
    const { data, error } = await supabase
      .from("extracted_texts")
      .insert([{ text: extractedText }]);

    if (error) {
      console.error("Supabase insertion error:", error.message);
      return res.status(500).json({ error: "Failed to save extracted text to Supabase." });
    }

    res.status(200).json({ extractedText, supabaseData: data });
  } catch (error) {
    console.error("File processing error:", error.message);
    res.status(500).json({ error: "Failed to process the file." });
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

    const generatedText = response.data.choices[0].message.content;

    // Save generated text to Supabase
    const { data, error } = await supabase
      .from("generated_texts")
      .insert([{ prompt, generated_text: generatedText }]);

    if (error) {
      console.error("Supabase insertion error:", error.message);
      return res.status(500).json({ error: "Failed to save generated text to Supabase." });
    }

    res.status(200).json({ generatedText, supabaseData: data });
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
    console.log('Generating image for prompt:', prompt); // Debug log to ensure the request is received

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      { prompt, n: 1, size: "512x512" },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    const imageUrl = response.data.data[0].url;

    // Save generated image to Supabase
    const { data, error } = await supabase
      .from("generated_images")
      .insert([{ prompt, image_url: imageUrl }]);

    if (error) {
      console.error("Supabase insertion error:", error.message);
      return res.status(500).json({ error: "Failed to save generated image to Supabase." });
    }

    res.status(200).json({ imageUrl, supabaseData: data });
  } catch (error) {
    console.error("Image generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

// Export for Vercel
module.exports = app;

// Helper function for PDF processing
async function processPdf(buffer) {
  // Add logic to process PDF from buffer
  return "Upload Another File"; // Placeholder
}

// Ensure the server is listening on the correct port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
