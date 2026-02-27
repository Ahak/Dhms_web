import axios from 'axios';


const isDevelopment = import.meta.env.MODE === 'development'
const MyBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY

const getOriginFromBaseUrl = (baseUrl) => {
  if (!baseUrl) return '';
  try {
    const parsed = new URL(baseUrl);
    return parsed.origin;
  } catch {
    return String(baseUrl).replace(/\/api\/?$/, '');
  }
};

const ApiOrigin = getOriginFromBaseUrl(MyBaseUrl);

// Create axios instance with base URL
const api = axios.create({
  baseURL: MyBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${ApiOrigin}${normalizedPath}`;
};

export default api;
