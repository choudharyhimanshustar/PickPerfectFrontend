"use client"
import axios from 'axios';
console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
const axiosInstance = axios.create({  
withCredentials: true, // ✅ IMPORTANT
});

export default axiosInstance;