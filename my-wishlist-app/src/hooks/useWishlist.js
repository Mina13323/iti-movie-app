import { useState, useEffect } from 'react';

const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('movieWishlist')) || [];
    setWishlistItems(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updated);
    localStorage.setItem('movieWishlist', JSON.stringify(updated));
  };

  return {
    wishlistItems,
    removeFromWishlist,
    count: wishlistItems.length
  };
};

export default useWishlist;