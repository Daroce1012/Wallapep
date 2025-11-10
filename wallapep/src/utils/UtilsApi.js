export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
};

export const getApiKey = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("apiKey");
};

export const getApiHeaders = (includeApiKey = true, contentType = 'application/json') => {
  let headers = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (includeApiKey) {
    const apiKey = getApiKey();
    if (apiKey) {
      headers['apikey'] = apiKey;
    }
  }
  
  return headers;
};

export const checkURL = async (url) => {
  try {
    let response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const apiGet = async (endpoint, options = {}) => {
  try {
    let baseUrl = getBackendBaseUrl();
    if (!baseUrl) {
      throw new Error('Backend base URL is not configured. Please set NEXT_PUBLIC_BACKEND_BASE_URL in your .env file.');
    }
    
    let url = baseUrl + endpoint;
    
    if (!url || url === 'undefined' || url.startsWith('undefined')) {
      throw new Error(`Invalid URL: ${url}. Check NEXT_PUBLIC_BACKEND_BASE_URL environment variable.`);
    }
    
    if (options.params) {
      let queryString = new URLSearchParams(options.params).toString();
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    
    let headers = options.headers || getApiHeaders(options.includeApiKey !== false);
    console.log("API GET URL header:", headers);
    let response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (response.ok) {
      var responseBody = await response.json();
      return responseBody;
      
    } else {
      await handleApiError(response, options.onError);
      return null;
    }
  } catch (error) {
    console.error(`Error in API GET ${endpoint}:`, error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      let errorMessage = 'Network error: Could not connect to the backend. Please check if the backend server is running and NEXT_PUBLIC_BACKEND_BASE_URL is correctly configured.';
      console.error(errorMessage);
      if (options.onError) {
        options.onError([{ msg: errorMessage }]);
      }
    } else if (options.onError) {
      options.onError([{ msg: error.message || 'Unknown error occurred' }]);
    }
    return null;
  }
};

export const apiPost = async (endpoint, body, options = {}) => {
  try {
    let url = getBackendBaseUrl() + endpoint;
    let headers = options.headers;
    
    if (!headers) {
      headers = getApiHeaders(options.includeApiKey !== false);
    }
    
    if (body instanceof FormData) {
      let { 'Content-Type': _, ...headersWithoutContentType } = headers;
      headers = headersWithoutContentType;
    }
    
    let response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      await handleApiError(response, options.onError);
      return null;
    }
  } catch (error) {
    console.error(`Error in API POST ${endpoint}:`, error);
    if (options.onError) {
      options.onError(error);
    }
    return null;
  }
};

export const apiPut = async (endpoint, body, options = {}) => {
  try {
    let url = getBackendBaseUrl() + endpoint;
    let headers = options.headers || getApiHeaders(options.includeApiKey !== false);
    
    let response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body)
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      await handleApiError(response, options.onError);
      return null;
    }
  } catch (error) {
    console.error(`Error in API PUT ${endpoint}:`, error);
    if (options.onError) {
      options.onError(error);
    }
    return null;
  }
};

export const apiDelete = async (endpoint, options = {}) => {
  try {
    let url = getBackendBaseUrl() + endpoint;
    let headers = options.headers || getApiHeaders(options.includeApiKey !== false);
    
    let response = await fetch(url, {
      method: 'DELETE',
      headers: headers
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      await handleApiError(response, options.onError);
      return null;
    }
  } catch (error) {
    console.error(`Error in API DELETE ${endpoint}:`, error);
    if (options.onError) {
      options.onError(error);
    }
    return null;
  }
};

export const handleApiError = async (response, onError) => {
  try {
    let responseBody = await response.json();
    let serverErrors = responseBody.errors || [];
    
    serverErrors.forEach((e) => {
      console.log("Error: " + e.msg);
    });
    
    if (onError) {
      onError(serverErrors, responseBody);
    }
  } catch (error) {
    console.error("Error parsing error response:", error);
    if (onError) {
      onError([{ msg: "Unknown error" }], null);
    }
  }
};

