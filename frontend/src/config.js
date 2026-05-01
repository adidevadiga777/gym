// frontend/src/config.js
export const BASE_URL = import.meta.env.MODE === 'production'
    ? 'https://apna-member-api.onrender.com'
    : `http://${window.location.hostname}:${window.location.hostname === 'localhost' ? '3000' : '3000'}`;

export const API_URL = `${BASE_URL}/api`;
// export const API_URL = 'http://192.168.1.2:3000/api'; 
// export const API_URL = 'https://apna-member-backend.onrender.com/api';
