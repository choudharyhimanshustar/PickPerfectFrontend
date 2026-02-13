"use client"
import axios from 'axios';

const axiosInstance = axios.create({
  withCredentials: true,
});

let isRefreshing = false;
let refreshFailed = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Call this after a successful login to re-enable refresh attempts
export const resetRefreshState = () => {
  refreshFailed = false;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints, already-retried requests, or if refresh already failed
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      refreshFailed ||
      originalRequest.url === "/api/auth/refresh" ||
      originalRequest.url === "/api/auth/login" ||
      originalRequest.url === "/api/auth/signup"
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => axiosInstance(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post("/api/auth/refresh", {}, { withCredentials: true });
      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      refreshFailed = true;
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;