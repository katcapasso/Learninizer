import React from "react";

const AITextGeneration = () => {
  return (
    <section className="ai-text-generation-section">
      <h2>Ask ChatGPT</h2>
      <textarea
        id="user-prompt"
        placeholder="Type your question here to get a response from ChatGPT..."
      ></textarea>
      <button id="submit-prompt-btn" className="btn">
        Submit Prompt
      </button>
      <div id="chatgpt-response">
        <h3>ChatGPT Response:</h3>
        <p id="response-text">No response yet.</p>
      </div>
      <p id="chatgpt-error-feedback" className="feedback error-feedback">
        No errors yet.
      </p>
    </section>
  );
};

export default AITextGeneration;
