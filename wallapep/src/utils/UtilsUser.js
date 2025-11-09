/**
 * Utility functions for user information
 */

/**
 * Get user information from API key stored in localStorage
 * @returns {Object|null} Object with id and email, or null if not available
 */
export let getUserInfoFromApiKey = () => {
  if (typeof window === 'undefined') return null;
  
  let apiKey = localStorage.getItem("apiKey");
  if (!apiKey) return null;
  
  try {
    let payload = apiKey.split('.')[1];
    let decoded = JSON.parse(atob(payload));
    return { id: decoded.id, email: decoded.email };
  } catch (error) {
    return null;
  }
};

/**
 * Get user ID from API key
 * @returns {number|null} User ID or null if not available
 */
export let getUserIdFromApiKey = () => {
  let userInfo = getUserInfoFromApiKey();
  return userInfo ? userInfo.id : null;
};

/**
 * Get user email from API key
 * @returns {string|null} User email or null if not available
 */
export let getUserEmailFromApiKey = () => {
  let userInfo = getUserInfoFromApiKey();
  return userInfo ? userInfo.email : null;
};

