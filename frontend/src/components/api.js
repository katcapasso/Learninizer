const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export const fetchTestData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        if (!response.ok) {
            throw new Error('Failed to fetch data from backend');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error connecting to backend:', error);
        throw error;
    }
};

export const generateImage = async (prompt) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error generating image: ${text}`);
        }

        const data = await response.json();
        if (data.imageUrl) {
            return data.imageUrl;
        } else {
            throw new Error('No image URL returned from the server');
        }
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
};
