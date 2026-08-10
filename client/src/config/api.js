// API Configuration for local dev & production
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (API_BASE_URL) {
    return cleanEndpoint.startsWith('/api') 
      ? `${API_BASE_URL}${cleanEndpoint}` 
      : `${API_BASE_URL}/api${cleanEndpoint}`;
  }
  return cleanEndpoint;
};
