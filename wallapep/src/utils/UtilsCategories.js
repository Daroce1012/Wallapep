export const categoryLabels = {
  'todos':           { label: 'All', emoji: '🛍️' },
  'Electronics':   { label: 'Technology',            emoji: '📱' },
  'Home':          { label: 'Furniture & Home',      emoji: '🏠' },
  'Fashion':       { label: 'Fashion & Accessories', emoji: '👗' },
  'Books&Music':   { label: 'Books & Music',         emoji: '📚🎵' },
  'Sports':        { label: 'Sports & Leisure',      emoji: '⚽️' },
  'Motor':         { label: 'Motor',                 emoji: '🚗' },
  'Toys':          { label: 'Toys',                  emoji: '🧸' },
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

