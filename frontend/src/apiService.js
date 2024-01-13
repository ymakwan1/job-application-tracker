import axios from "axios";
const API_BASE_URL = 'http://localhost:5001/api';
const apiService = axios.create({
    baseURL : API_BASE_URL,
    headers : {
        'Content-Type' : 'application/json'
    }
});

export default apiService;