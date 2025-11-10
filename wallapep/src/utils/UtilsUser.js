// Utility functions for user information
import { apiGet, getApiKey } from './UtilsApi';

// Get user data by user ID from API. Returns Promise<Object|null>
export let fetchUserById = async (userId) => {
  if (!userId) return null;
  try {
    const userData = await apiGet(`/users/${userId}`);
    return userData || null;
  } catch (error) {
    console.error(`Error loading user data for user ${userId}:`, error);
    return null;
  }
};

// Get user information from API key stored in localStorage. Returns Object with id and email, or null if not available
export let getUserInfoFromApiKey = () => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  
  try {
    let payload = apiKey.split('.')[1];
    let decoded = JSON.parse(atob(payload));
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    return null;
  }
};

// Get user ID from API key. Returns number or null if not available
export let getUserIdFromApiKey = () => {
  let userInfo = getUserInfoFromApiKey();
  return userInfo ? userInfo.id : null;
};

// Get user email from API key. Returns string or null if not available
export let getUserEmailFromApiKey = () => {
  let userInfo = getUserInfoFromApiKey();
  return userInfo ? userInfo.email : null;
};

// Get user email by user ID from API. Optimized: If the userId matches the current user, uses the API key to avoid an API call. Returns Promise<string|null>
export let getUserEmailById = async (userId) => {
  if (!userId) return null;
  
  // Optimización: Si es el usuario actual, usar el email del API key (más rápido)
  const currentUserId = getUserIdFromApiKey();
  if (currentUserId && String(currentUserId) === String(userId)) {
    return getUserEmailFromApiKey();
  }
  
  // Si es otro usuario, obtener el email desde la API
  try {
    const userData = await fetchUserById(userId);
    return userData && userData.email ? userData.email : null;
  } catch (error) {
    console.error(`Error loading email for user ${userId}:`, error);
    return null;
  }
};

