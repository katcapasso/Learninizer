// frontend/pages/api/extract-text.js

import multer from "multer";
import Tesseract from "tesseract.js";
import { IncomingForm } from "formidable";

const upload = multer({ storage: multer.memoryStorage() });

export default function handler(req, res) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to parse file" });
      }

      if (!files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { file } = files;
      const { buffer, mimetype } = file;

      let extractedText = "";

      if (mimetype === "application/pdf") {
        // Implement PDF text extraction
        extractedText = "PDF extraction logic here";
      } else if (mimetype.startsWith("image/")) {
        Tesseract.recognize(buffer, "eng")
          .then(({ data }) => {
            extractedText = data.text;
            res.status(200).json({ extractedText });
          })
          .catch((error) => {
            res.status(500).json({ error: "Error processing image" });
          });
      } else {
        res.status(400).json({ error: "Unsupported file type" });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
