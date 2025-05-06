// Simple favorites service using localStorage
export function getFavorites() {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

export function toggleFavorite(listingId) {
  try {
    let favorites = getFavorites();
    
    if (favorites.includes(listingId)) {
      favorites = favorites.filter(id => id !== listingId);
    } else {
      favorites.push(listingId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return favorites;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return getFavorites();
  }
}