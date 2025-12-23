import axios from "axios";

const server = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: server,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🔒 Guard against undefined response
    if (
      error.response?.status === 403 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${server}/api/v1/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue();
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
