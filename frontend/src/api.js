// src/api.js
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export const fetchTestData = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/test`);
        if (!response.ok) {
            throw new Error('Failed to fetch data from backend');
        }
        const data = await response.json();
        console.log('Backend Response:', data);
        return data;
    } catch (error) {
        console.error('Error connecting to backend:', error);
        throw error;
    }
};
