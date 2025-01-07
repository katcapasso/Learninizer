import React, { useEffect } from 'react';

const TestComponent = () => {
    useEffect(() => {
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

        const fetchData = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/test`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data from backend');
                }
                const data = await response.json();
                console.log('Backend Response:', data);
            } catch (error) {
                console.error('Error connecting to backend:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once

    return (
        <div>
            <h1>Backend Data Fetch Example</h1>
        </div>
    );
};

export default TestComponent;
