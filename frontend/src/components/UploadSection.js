import React, { useState } from "react";
import { API_BASE_URL } from "../config"; // Use named import for API base URL

const UploadSection = () => {
  const [uploadFeedback, setUploadFeedback] = useState("No file uploaded yet."); // Feedback message for the user
  const [extractedText, setExtractedText] = useState(""); // Stores the extracted text
  const [isUploading, setIsUploading] = useState(false); // Tracks upload state

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) {
      setUploadFeedback("Please select a file."); // Update feedback
      return;
    }

    const formData = new FormData(); // Create FormData for the file
    formData.append("file", file);

    setUploadFeedback("Uploading and processing file...");
    setIsUploading(true); // Indicate the upload is in progress

    try {
      // Send the file to the backend
      const response = await fetch(`${API_BASE_URL}/api/extract-text`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // If the backend responds with an error
        const errorData = await response.json();
        setUploadFeedback(errorData.error || "Failed to upload file.");
        return;
      }

      const data = await response.json(); // Parse the JSON response
      setExtractedText(data.extractedText || "No text extracted.");
      setUploadFeedback("File processed successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadFeedback("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false); // Reset upload state
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
        onChange={handleFileChange} // Attach the event handler
        disabled={isUploading} // Disable input during upload
      />
      <p id="upload-feedback" className="feedback">
        {uploadFeedback} {/* Display the feedback message */}
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
