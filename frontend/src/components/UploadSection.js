import React, { useState } from "react";
import { API_BASE_URL } from "../config";

const UploadSection = ({ onExtractedText }) => {
  const [uploadFeedback, setUploadFeedback] = useState("No file uploaded yet.");
  const [extractedText, setExtractedText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadFeedback("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadFeedback("Uploading and processing file...");
    setIsUploading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/extract-text`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadFeedback(errorData.error || "Failed to upload file.");
        return;
      }

      const data = await response.json();
      setExtractedText(data.extractedText || "No text extracted.");
      setUploadFeedback("File processed successfully!");
      onExtractedText(data.extractedText);
    } catch (error) {
      setUploadFeedback("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="upload-section">
      <h2>Upload Image or PDF</h2>
      <label htmlFor="file-upload" className="upload-label">
        Choose a file:
      </label>
      <input
        type="file"
        id="file-upload"
        accept="image/*, .pdf"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <p id="upload-feedback" className="feedback">
        {uploadFeedback}
      </p>
      {extractedText && (
        <textarea
          id="extracted-text"
          placeholder="Extracted text will appear here..."
          value={extractedText}
          readOnly
        />
      )}
    </section>
  );
};

export default UploadSection;
