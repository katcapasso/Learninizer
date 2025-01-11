import React, { useState, useEffect } from "react";
import "../styles/App.css";
import "../styles/style.css";
import UploadSection from "./UploadSection";
import ExtractedTextSection from "./ExtractedTextSection";
import AIImageGeneration from "./AIImageGeneration";
import AITextGeneration from "./AITextGeneration";
import Footer from "./Footer";
import { fetchTestData } from "./api";

function App() {
  const [extractedText, setExtractedText] = useState("");
  const [backendData, setBackendData] = useState(null);
  const [backendError, setBackendError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTestData();
        setBackendData(data);
      } catch (error) {
        setBackendError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleExtractedText = (text) => {
    setExtractedText(text);
  };

  return (
    <div className="container">
      <header>
        <h1>Learninizer: Text to Image Learning Tool</h1>
        <p>Convert text into learning tools with AI-powered features.</p>
        {backendError ? (
          <p className="error">Error: {backendError}</p>
        ) : backendData ? (
          <p className="success">Backend Connected: {backendData.message}</p>
        ) : (
          <p>Loading backend status...</p>
        )}
      </header>
      <main>
        <UploadSection onExtractedText={handleExtractedText} />
        <ExtractedTextSection extractedText={extractedText} />
        <AIImageGeneration />
        <AITextGeneration />
      </main>
      <Footer />
    </div>
  );
}

export default App;
