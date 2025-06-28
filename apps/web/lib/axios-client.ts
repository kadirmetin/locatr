import axios from 'axios';

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'X-Client-App': 'web',
  },
};

const API = axios.create(options);
export const APIRefresh = axios.create(options);

APIRefresh.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Network error or server timeout',
        originalError: error,
      });
    }

    const { data, status, config } = error.response;

    if (data?.errorCode === 'AUTH_TOKEN_NOT_FOUND' && status === 401) {
      try {
        await APIRefresh.get('/auth/refresh');

        return API(config);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
        return Promise.reject({
          message: 'Authentication failed',
          originalError: refreshError,
        });
      }
    }

    return Promise.reject({
      ...data,
      status,
      originalError: error,
    });
  }
);

export default API;
