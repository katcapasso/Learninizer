// src/components/ExtractedTextSection.js
const EXTRACTED_TEXT_PLACEHOLDER = "Extracted text will appear here...";

const ExtractedTextSection = ({ extractedText }) => {
  return (
    <section id="text-display" className="text-display">
      <h2>Extracted Text</h2>
      <textarea
        id="extracted-text"
        placeholder={EXTRACTED_TEXT_PLACEHOLDER}
        value={extractedText} // Ensure it updates with the extracted text
        readOnly
      />
      <button id="highlight-btn" className="btn">
        Highlight Text
      </button>
    </section>
  );
};

export default ExtractedTextSection;
