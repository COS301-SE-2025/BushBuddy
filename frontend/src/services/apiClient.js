import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
	baseURL: '',
	// baseURL: "http://localhost:3000/",
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

axios.defaults.withCredentials = true;

// When we start intercepting requests, do it here

export default apiClient;
