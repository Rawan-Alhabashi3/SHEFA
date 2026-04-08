import { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { addNotification } = useNotification();

  // 🛒 Cart
  const [cart, setCart] = useState([]);

  // ❤️ Favorites (مع localStorage)
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  // 🔥 حفظ الفافوريت
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 🛒 Cart functions
  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].pharmacy !== item.pharmacy) {
      addNotification("TEST NOTIFICATION 🔥");
      return;
    }
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ❤️ Favorites functions
  const addToFavorites = (item) => {
    const exists = favorites.find((f) => f.id === item.id);
    if (!exists) {
      setFavorites((prev) => [...prev, item]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,

        favorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);