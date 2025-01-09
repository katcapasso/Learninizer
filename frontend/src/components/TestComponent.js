// src/components/TestComponent.js
import { useEffect, useState } from 'react'; // No need to import React explicitly

// Constants for backend URL and API endpoints
const DEFAULT_BACKEND_URL = 'http://localhost:4000';
const API_TEST_ENDPOINT = '/api/test';

const TestComponent = () => {
    const [backendData, setBackendData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || DEFAULT_BACKEND_URL;

        const fetchData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}${API_TEST_ENDPOINT}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data from backend');
                }
                const data = await response.json();
                setBackendData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once

    return (
        <div>
            <h1>Backend Data Fetch Example</h1>
            {error && <p className="error">{error}</p>}
            {backendData && <pre>{JSON.stringify(backendData, null, 2)}</pre>}
        </div>
    );
};

export default TestComponent;
