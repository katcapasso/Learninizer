import React, { useState } from "react";
import { API_BASE_URL } from "../config";

const AITextGeneration = () => {
  const [responseText, setResponseText] = useState("");

  const handleSubmitPrompt = async () => {
    const prompt = document.getElementById("user-prompt").value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Error generating text");
      }

      const data = await response.json();
      setResponseText(data.generatedText || "No response from AI.");
    } catch (error) {
      console.error("Error submitting prompt:", error);
    }
  };

  return (
    <section className="ai-text-generation-section">
      <h2>Ask ChatGPT</h2>
      <textarea id="user-prompt" placeholder="Type your question here to get a response from ChatGPT..."></textarea>
      <button id="submit-prompt-btn" className="btn" onClick={handleSubmitPrompt}>
        Submit Prompt
      </button>
      <div id="chatgpt-response">
        <h3>ChatGPT Response:</h3>
        <p id="response-text">{responseText || "No response yet."}</p>
      </div>
    </section>
  );
};

export default AITextGeneration;
