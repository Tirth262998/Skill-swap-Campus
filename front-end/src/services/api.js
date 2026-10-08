const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


export const apiCall = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', 
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      
      const errorMessage =
        responseData?.message ||
        responseData?.error?.message ||
        `Request failed with status ${response.status}`;

      return {
        success: false,
        status: response.status,
        message: errorMessage,
        error: responseData?.error || {},
      };
    }

    return {
      success: true,
      status: response.status,
      message: responseData?.message || 'Success',
      data: responseData?.data || {},
    };
  } catch (err) {
    console.error(`API Call error [${url}]:`, err);
    return {
      success: false,
      status: 0,
      message: err.message || 'Unable to connect to the backend server. Please check if the backend is running.',
      error: {},
    };
  }
};
