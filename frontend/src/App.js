import React, { useState, useEffect } from "react";
import "./App.css";
import UploadSection from "./components/UploadSection";
import ExtractedTextSection from "./components/ExtractedTextSection";
import AIImageGeneration from "./components/AIImageGeneration";
import AITextGeneration from "./components/AITextGeneration";
import Footer from "./components/Footer";

function App() {
  const [extractedText, setExtractedText] = useState("");
  const [backendData, setBackendData] = useState(null);
  const [backendError, setBackendError] = useState(null);

  // Fetch data from the backend when the app loads
  useEffect(() => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/test`);
        if (!response.ok) {
          throw new Error("Failed to fetch data from backend");
        }
        const data = await response.json();
        console.log("Backend Response:", data);
        setBackendData(data);
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setBackendError(error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on component mount

  const handleExtractedText = (text) => {
    setExtractedText(text);
  };

  return (
    <div className="container">
      <header>
        <h1>Learninizer: Text to Image Learning Tool</h1>
        <p>Convert text into learning tools with AI-powered features.</p>
        {/* Display backend connection status */}
        {backendError ? (
          <p className="error">Error: {backendError}</p>
        ) : (
          backendData && <p className="success">Backend Connected: {backendData.message}</p>
        )}
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
