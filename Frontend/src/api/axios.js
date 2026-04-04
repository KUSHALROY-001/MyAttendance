import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  // Use the same target we run on / proxy
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    
    // Check if error response exists (i.e. server responded)
    if (error.response) {
      const { status, data } = error.response;
      
      // Auto redirect to login on 401 Unauthorized
      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        // Clear local storage or context if you had any
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Render the server's ApiError message via toast UNLESS component opted out
      if (!error.config?.hideGlobalToast) {
        const errorMessage = data?.message || "An unexpected server error occurred.";
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Network error. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default api;
