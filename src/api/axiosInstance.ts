"use client"
import axios from 'axios';
console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
const axiosInstance = axios.create({  
baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
headers: {  
'Content-Type': 'video/mp4',  
},  
});

export default axiosInstance;