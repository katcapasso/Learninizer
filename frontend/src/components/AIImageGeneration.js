import { useState } from "react";
import { API_BASE_URL } from "../config";  // Ensure you are importing API_BASE_URL here

const AIImageGeneration = () => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateImage = async () => {
    const prompt = document.getElementById("selected-text").value.trim();
    if (!prompt) {
      alert("Please provide a valid prompt.");
      return;
    }

    setLoading(true);
    setError(null); // Reset error message

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          });          

      if (!response.ok) {
        // Handle unexpected responses
        const text = await response.text(); // Get the error message in text format
        throw new Error(`Error generating image: ${text}`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        setError("No image URL returned from the server.");
      }
    } catch (error) {
      setError(`Error generating image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="image-creation" className="image-creation">
      <h2>Generate AI Image</h2>
      <textarea
        id="selected-text"
        placeholder="Highlight or edit text to create an AI-powered image"
        aria-label="Input text to generate AI-powered image"
      ></textarea>
      <button
        id="generate-image-btn"
        className="btn"
        onClick={handleGenerateImage}
        disabled={loading}
      >
        Generate AI Image
      </button>
      {loading && <p>Loading image...</p>} {/* Display loading message */}
      {error && <p className="error">{error}</p>} {/* Display error message if any */}
      {generatedImageUrl && (
        <div id="image-display">
          <h3>Generated Image:</h3>
          <img
            id="generated-image"
            src={generatedImageUrl}
            alt="AI-generated content"
            style={{
              maxWidth: "100%",
              display: "block",
              border: "1px solid #ccc",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </section>
  );
};

export default AIImageGeneration;
