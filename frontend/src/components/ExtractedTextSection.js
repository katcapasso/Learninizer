import React from "react";

const ExtractedTextSection = () => {
  return (
    <section id="text-display" className="text-display">
      <h2>Extracted Text</h2>
      <textarea
        id="extracted-text"
        placeholder="Extracted text will appear here..."
        readOnly
      ></textarea>
      <button id="highlight-btn" className="btn">
        Highlight Text
      </button>
      <p id="ocr-error-feedback" className="feedback error-feedback">
        No errors yet.
      </p>
    </section>
  );
};

export default ExtractedTextSection;
