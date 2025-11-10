export const categoryLabels = {
  'todos': { label: 'All', emoji: '🛍️' },
  'fashion': { label: 'Fashion', emoji: '👕' },
  'technology': { label: 'Technology', emoji: '📱' },
  'home': { label: 'Home', emoji: '🏠' },
  'sports': { label: 'Sports', emoji: '🚴' },
  'kids': { label: 'Kids', emoji: '👶' },
  'consola': { label: 'Console', emoji: '🎮' },
  'planta': { label: 'Plant', emoji: '🌿' },
};

export const getCategoriesForSelect = () => {
    // Excluir la categoría 'todos' que es solo para filtros generales
    return Object.keys(categoryLabels)
        .filter(key => key !== 'todos')
        .map(key => ({
            value: key,
            label: `${categoryLabels[key].emoji} ${categoryLabels[key].label}`,
        }));
};

