/**
 * Utilidades para llamadas API
 */

/**
 * Obtiene la URL base del backend
 */
export const getBackendBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
};

/**
 * Obtiene los headers comunes para las peticiones API
 * @param {boolean} includeApiKey - Si incluir el API key en los headers
 * @param {string} contentType - Tipo de contenido (default: 'application/json')
 * @returns {Object} Headers para la petición
 */
export const getApiHeaders = (includeApiKey = true, contentType = 'application/json') => {
  let headers = {};
  
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  
  if (includeApiKey) {
    let apiKey = localStorage.getItem("apiKey");
    if (apiKey) {
      headers['apikey'] = apiKey;
    }
  }
  
  return headers;
};

/**
 * Verifica si una URL existe (retorna 200)
 * @param {string} url - URL a verificar
 * @returns {Promise<boolean>} true si la URL existe, false en caso contrario
 */
export const checkURL = async (url) => {
  try {
    let response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Realiza una petición GET al API
 * @param {string} endpoint - Endpoint relativo (ej: "/products")
 * @param {Object} options - Opciones adicionales (query params, headers personalizados, etc.)
 * @returns {Promise<Object>} Respuesta parseada o null si hay error
 */
export const apiGet = async (endpoint, options = {}) => {
  try {
    let baseUrl = getBackendBaseUrl();
    if (!baseUrl) {
      throw new Error('Backend base URL is not configured. Please set NEXT_PUBLIC_BACKEND_BASE_URL in your .env file.');
    }
    
    let url = baseUrl + endpoint;
    
    // Validar que la URL esté bien formada
    if (!url || url === 'undefined' || url.startsWith('undefined')) {
      throw new Error(`Invalid URL: ${url}. Check NEXT_PUBLIC_BACKEND_BASE_URL environment variable.`);
    }
    
    // Agregar query params si existen
    if (options.params) {
      let queryString = new URLSearchParams(options.params).toString();
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    
    let headers = options.headers || getApiHeaders(options.includeApiKey !== false);
    
    let response = await fetch(url, {
      method: 'GET',
      headers: headers
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      await handleApiError(response, options.onError);
      return null;
    }
  } catch (error) {
    console.error(`Error in API GET ${endpoint}:`, error);
    
    // Si es un error de red, mostrar un mensaje más claro
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

/**
 * Realiza una petición POST al API
 * @param {string} endpoint - Endpoint relativo (ej: "/products")
 * @param {Object} body - Cuerpo de la petición
 * @param {Object} options - Opciones adicionales (headers personalizados, etc.)
 * @returns {Promise<Object>} Respuesta parseada o null si hay error
 */
export const apiPost = async (endpoint, body, options = {}) => {
  try {
    let url = getBackendBaseUrl() + endpoint;
    let headers = options.headers;
    
    // Si no se proporcionan headers personalizados, usar los headers por defecto
    if (!headers) {
      headers = getApiHeaders(options.includeApiKey !== false);
    }
    
    // Si el body es FormData, no incluir Content-Type (el navegador lo establece automáticamente)
    if (body instanceof FormData) {
      // Remover Content-Type si existe para que el navegador lo establezca con el boundary correcto
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

/**
 * Realiza una petición PUT al API
 * @param {string} endpoint - Endpoint relativo (ej: "/products/123")
 * @param {Object} body - Cuerpo de la petición
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Respuesta parseada o null si hay error
 */
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

/**
 * Realiza una petición DELETE al API
 * @param {string} endpoint - Endpoint relativo (ej: "/products/123")
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Respuesta parseada o null si hay error
 */
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

/**
 * Maneja errores de la API
 * @param {Response} response - Respuesta de la petición
 * @param {Function} onError - Callback opcional para manejar el error
 */
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

