import React from "react";

const AIImageGeneration = () => {
  return (
    <section id="image-creation" className="image-creation">
      <h2>Generate AI Image</h2>
      <textarea
        id="selected-text"
        placeholder="Highlight or edit text to create an AI-powered image"
        aria-label="Input text to generate AI-powered image"
      ></textarea>
      <button id="generate-image-btn" className="btn">
        Generate AI Image
      </button>
      <div id="image-display">
        <h3>Generated Image:</h3>
        <img
          id="generated-image"
          alt="AI-generated content"
          style={{
            maxWidth: "100%",
            display: "none",
            border: "1px solid #ccc",
            borderRadius: "10px",
          }}
        />
        <p id="image-placeholder">No image generated yet.</p>
      </div>
      <p id="image-error-feedback" className="feedback error-feedback">
        No errors yet.
      </p>
    </section>
  );
};

export default AIImageGeneration;
