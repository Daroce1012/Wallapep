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

const executeApiCall = async (method, endpoint, options = {}) => {
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

  let headers = options.headers || getApiHeaders(options.includeApiKey !== false, options.contentType);
  let body = options.body;

  if (body instanceof FormData) {
    // FormData automáticamente establece Content-Type, así que lo eliminamos si está presente
    let { 'Content-Type': _, ...headersWithoutContentType } = headers;
    headers = headersWithoutContentType;
  } else if (body && typeof body === 'object' && headers['Content-Type'] === 'application/json') {
    body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body
    });

    if (response.ok) {
      return await response.json();
    } else {
      await handleApiError(response, options.onError);
      return null;
    }
  } catch (error) {
    console.error(`Error in API ${method} ${endpoint}:`, error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const errorMessage = 'Network error: Could not connect to the backend. Please check if the backend server is running and NEXT_PUBLIC_BACKEND_BASE_URL is correctly configured.';
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

export const apiGet = async (endpoint, options = {}) => {
  return executeApiCall('GET', endpoint, options);
};

export const apiPost = async (endpoint, body, options = {}) => {
  return executeApiCall('POST', endpoint, { ...options, body });
};

export const apiPut = async (endpoint, body, options = {}) => {
  return executeApiCall('PUT', endpoint, { ...options, body });
};

export const apiDelete = async (endpoint, options = {}) => {
  return executeApiCall('DELETE', endpoint, options);
};

export const fetchUserCounts = async (userId) => {
  try {
    const [sales, purchases, productsData] = await Promise.all([
      apiGet("/transactions/public", { params: { sellerId: userId } }),
      apiGet("/transactions/public", { params: { buyerId: userId } }),
      apiGet("/products", { params: { sellerId: userId } })
    ]);

    let allTransactions = [];
    let salesCount = 0;
    let purchasesCount = 0;

    if (sales) {
      allTransactions = [...allTransactions, ...sales];
      salesCount = sales.length;
    }

    if (purchases) {
      allTransactions = [...allTransactions, ...purchases];
      purchasesCount = purchases.length;
    }

    // Remove duplicates based on transaction id
    let uniqueTransactions = allTransactions.filter((transaction, index, self) =>
      index === self.findIndex(t => t.id === transaction.id)
    );

    let productsCount = productsData ? productsData.length : 0;

    return {
      transactionsCount: uniqueTransactions.length,
      totalSales: salesCount,
      totalPurchases: purchasesCount,
      productsCount: productsCount,
    };
  } catch (error) {
    console.error("Error loading user counts:", error);
    return {
      transactionsCount: 0,
      totalSales: 0,
      totalPurchases: 0,
      productsCount: 0,
    };
  }
};

export const fetchUserTransactions = async () => {
  try {
    const data = await apiGet("/transactions/own");
    if (data) {
      return data.map(t => ({
        ...t,
        key: t.tid || t.id
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error loading user transactions:", error);
    return [];
  }
};

export const fetchProducts = async (sellerId = null) => {
  try {
    let endpoint = "/products";
    let options = {};
    if (sellerId) {
      options.params = { sellerId: sellerId };
    } else {
      endpoint = "/products/own/";
    }
    const data = await apiGet(endpoint, options);
    if (data) {
      return data.map(p => ({ ...p, key: p.id }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
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

