import React, { useState } from "react";
import "./App.css";
import UploadSection from "./components/UploadSection";
import ExtractedTextSection from "./components/ExtractedTextSection";
import AIImageGeneration from "./components/AIImageGeneration";
import AITextGeneration from "./components/AITextGeneration";
import Footer from "./components/Footer";

function App() {
  const [extractedText, setExtractedText] = useState("");

  const handleExtractedText = (text) => {
    setExtractedText(text);
  };

  return (
    <div className="container">
      <header>
        <h1>Learninizer: Text to Image Learning Tool</h1>
        <p>Convert text into learning tools with AI-powered features.</p>
      </header>
      <UploadSection onExtractedText={handleExtractedText} />
      <ExtractedTextSection extractedText={extractedText} />
      <AIImageGeneration />
      <AITextGeneration />
      <Footer />
    </div>
  );
}

export default App;
