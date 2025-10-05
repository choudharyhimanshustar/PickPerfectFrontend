import axios from 'axios';

const axiosInstance = axios.create({  
baseURL: '[https://api.example.com](https://api.example.com/)',  
headers: {  
'Content-Type': 'multipart/form-data',  
},  
});

export default axiosInstance;