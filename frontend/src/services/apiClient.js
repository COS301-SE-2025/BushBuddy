import axios from "axios"

const apiClient = axios.create({
    baseURL: "http://localhost:3000",  // just for local testing
    headers: {
        "Content-Type": "application/json",
    },
});

// When we start intercepting requests, do it here

export default apiClient;