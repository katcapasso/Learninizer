import React from "react"; // Ensure this import is included
import ReactDOM from "react-dom/client";
import App from "./components/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
    console.error("Root element not found!");
} else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
