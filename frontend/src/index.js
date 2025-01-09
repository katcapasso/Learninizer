import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Ensure the root element is found before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
    console.error("Root element not found!"); // Logs an error if the root element isn't found
} else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App /> {/* Render the main App component */}
        </React.StrictMode>
    );
}
