/**
 * Utilidades para productos
 */

import { getBackendBaseUrl } from './UtilsApi';

/**
 * Helper function to check if a URL exists.
 * @param {string} url - The URL to check.
 * @returns {Promise<boolean>} True if the URL returns a 2xx status, false otherwise.
 */
const checkURL = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Obtiene la URL de la imagen de un producto
 * @param {number} productId - ID del producto
 * @returns {string} URL de la imagen
 */
export const getProductImageUrl = (productId) => {
  return getBackendBaseUrl() + "/images/" + productId + ".png";
};

/**
 * Procesa la imagen de un producto (verifica si existe y asigna la URL o imagen por defecto)
 * @param {Object} product - Producto a procesar
 * @returns {Promise<Object>} Producto con la imagen procesada
 */
export const processProductImage = async (product) => {
  if (!product || !product.id) {
    return { ...product, image: "/imageMockup.png" };
  }
  
  let urlImage = getProductImageUrl(product.id);
  let existsImage = await checkURL(urlImage);
  
  return {
    ...product,
    image: existsImage ? urlImage : "/imageMockup.png"
  };
};

/**
 * Procesa las imágenes de múltiples productos
 * @param {Array<Object>} products - Array de productos
 * @returns {Promise<Array<Object>>} Array de productos con imágenes procesadas
 */
export const processProductsImages = async (products) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }
  
  let promises = products.map(product => processProductImage(product));
  return await Promise.all(promises);
};

