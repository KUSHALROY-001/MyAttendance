import axios from "axios";
import toast from "react-hot-toast";

const ACCESS_TOKEN_KEY = "auth_access_token";
const AUTH_USER_KEY = "auth_user";

let accessToken =
  typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
let refreshPromise = null;

const api = axios.create({
  withCredentials: true,
});

export const getStoredAccessToken = () => accessToken;

export const setStoredAuth = ({ token, user }) => {
  accessToken = token || null;

  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const clearStoredAuth = () => {
  accessToken = null;

  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

api.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.withCredentials = true;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const requestUrl = originalRequest.url || "";
    const isAuthRequest =
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/refresh");

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest &&
      !originalRequest.skipAuthRefresh
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            "/api/auth/refresh",
            {},
            { withCredentials: true, skipAuthRefresh: true },
          );
        }

        const refreshResponse = await refreshPromise;
        const nextToken = refreshResponse.data?.accessToken;
        const nextUser = refreshResponse.data?.user || getStoredUser();

        setStoredAuth({ token: nextToken, user: nextUser });
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${nextToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        clearStoredAuth();
        if (!originalRequest.hideAuthRedirect) {
          toast.error("Session expired. Please log in again.");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        refreshPromise = null;
      }
    }

    if (error.response) {
      if (!originalRequest.hideGlobalToast && status !== 401) {
        const errorMessage =
          error.response?.data?.message || "An unexpected server error occurred.";
        toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);

export default api;
