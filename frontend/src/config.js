// frontend/src/config.js
export const API_URL = import.meta.env.MODE === 'production' 
    ? 'https://apna-member-backend.onrender.com/api' 
    : 'http://192.168.1.2:3000/api';
// export const API_URL = 'https://apna-member-backend.onrender.com/api';
