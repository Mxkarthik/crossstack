import axios from "axios";

const server = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

/* ===== Cookie helper ===== */
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

/* ===== Axios instance ===== */
const api = axios.create({
  baseURL: server,
  withCredentials: true,
});

/* ===== REQUEST INTERCEPTOR (CSRF) ===== */
api.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();

    if (method === "post" || method === "put" || method === "delete") {
      const csrfToken = getCookie("csrfToken");
      if (csrfToken) {
        config.headers["x-csrf-token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===== REFRESH STATE ===== */
let isRefreshing = false;
let isRefreshingCSRFToken = false;

let failedQueue = [];
let csrfFailedQueue = [];

/* ===== Queue helpers ===== */
const processQueue = (queue, error = null) => {
  queue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  queue.length = 0;
};

/* ===== RESPONSE INTERCEPTOR ===== */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const errorCode = error.response.data?.code || "";

    /* ===== CSRF TOKEN EXPIRED ===== */
    if (status === 403 && errorCode.startsWith("CSRF_")) {
      if (isRefreshingCSRFToken) {
        return new Promise((resolve, reject) => {
          csrfFailedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshingCSRFToken = true;

      try {
        await axios.post(
          `${server}/api/v1/refresh-csrf`,
          {},
          { withCredentials: true }
        );

        processQueue(csrfFailedQueue);
        return api(originalRequest);

      } catch (err) {
        processQueue(csrfFailedQueue, err);
        return Promise.reject(err);

      } finally {
        isRefreshingCSRFToken = false;
      }
    }

    /* ===== ACCESS TOKEN EXPIRED ===== */
    if (status === 403) {
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

        processQueue(failedQueue);
        return api(originalRequest);

      } catch (err) {
        processQueue(failedQueue, err);
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
