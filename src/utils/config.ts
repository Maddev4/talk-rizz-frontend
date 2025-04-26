import axios from 'axios';

export const BASE_URL = "https://aichatbotassistant.app/test/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error responses here
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access. Redirecting to login...');
      // You might want to redirect to a login page here
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };