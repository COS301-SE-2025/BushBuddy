import axios from "axios"

const apiClient = axios.create({
    baseURL: "https://bushbuddy-api-dev.onrender.com/",
    headers: {
        "Content-Type": "application/json",
    },
});

// When we start intercepting requests, do it here

export default apiClient;