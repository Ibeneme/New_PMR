// src/utils/apiService.ts
import axios from 'axios';

// Set the base URL dynamically using environment variables or a static URL.
//const baseURL = process.env.REACT_APP_BASE_URL || 'https://padiman-route-admin-q7tl.onrender.com'; // Use the environment variable or default value
//http://localhost:3000

const baseURL = process.env.REACT_APP_BASE_URL || 'http://192.168.0.20:3000';
// Create an axios instance
const apiService = axios.create({
    baseURL, // Apply base URL here
});

export default apiService;