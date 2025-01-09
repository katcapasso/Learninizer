import React, { useState, useEffect } from "react";
import "../styles/App.css";  // Correct path for App-specific styles
import "../styles/style.css";  // Correct path for global styles
import UploadSection from "./UploadSection";
import ExtractedTextSection from "./ExtractedTextSection";
import AIImageGeneration from "./AIImageGeneration";
import AITextGeneration from "./AITextGeneration";
import Footer from "./Footer";
import { fetchTestData } from "./api"; // Import API functions

// Constants for backend URLs and endpoints
const API_TEST_ENDPOINT = "/api/test"; // Endpoint for testing backend connection

function App() {
  const [extractedText, setExtractedText] = useState(""); // Holds text extracted from uploaded files
  const [backendData, setBackendData] = useState(null); // Holds data returned from backend
  const [backendError, setBackendError] = useState(null); // Holds backend error messages

  // Fetch data from the backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTestData(); // Use the fetchTestData function from api.js
        setBackendData(data);
      } catch (error) {
        setBackendError(error.message); // Set the error message if request fails
      }
    };

    fetchData(); // Run fetchData function once on component mount
  }, []); // Empty dependency array ensures this effect runs only once

  // Handle extracted text from the UploadSection component
  const handleExtractedText = (text) => {
    setExtractedText(text); // Set extracted text state
  };

  return (
    <div className="container">
      <header>
        <h1>Learninizer: Text to Image Learning Tool</h1>
        <p>Convert text into learning tools with AI-powered features.</p>
        {/* Display backend connection status */}
        {backendError ? (
          <p className="error">Error: {backendError}</p> // Display error if any
        ) : backendData ? (
          <p className="success">Backend Connected: {backendData.message}</p> // Display success message if backend is connected
        ) : (
          <p>Loading backend status...</p> // Display loading message if backend data is not yet available
        )}
      </header>
      <main>
        {/* Pass extractedText handler to UploadSection */}
        <UploadSection onExtractedText={handleExtractedText} />
        {/* Display extracted text */}
        <ExtractedTextSection extractedText={extractedText} />
        {/* AI image generation component */}
        <AIImageGeneration />
        {/* AI text generation component */}
        <AITextGeneration />
      </main>
      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
