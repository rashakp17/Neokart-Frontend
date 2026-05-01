"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  size?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getApiUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : 'http://localhost:5000';
    return `${baseUrl}/api/v1`;
  };

  const getToken = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("heedy_user");
      if (userStr) {
        return JSON.parse(userStr).token;
      }
    }
    return null;
  };

  useEffect(() => {
    const initCart = async () => {
      const token = getToken();
      if (token) {
        try {
          const res = await axios.get(`${getApiUrl()}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success && res.data.data?.items) {
            const items = res.data.data.items.map((item: any) => {
              // Extract from variant
              const variant = item.product.variants?.find((v: any) => v.volume === item.size) || item.product.variants?.[0];
              
              return {
                id: item.product._id,
                name: item.product.name,
                image: item.product.images?.[0] || '',
                price: variant?.price || 0,
                currency: '₹',
                size: variant?.volume || item.size,
                quantity: item.quantity
              };
            });
            setCartItems(items);
            localStorage.setItem("heedy_cart", JSON.stringify(items));
          }
        } catch (err) {
          console.error("Failed to fetch cart from backend", err);
          const localCart = localStorage.getItem("heedy_cart");
          if (localCart) setCartItems(JSON.parse(localCart));
        }
      } else {
        const localCart = localStorage.getItem("heedy_cart");
        if (localCart) setCartItems(JSON.parse(localCart));
      }
      setIsLoaded(true);
    };
    initCart();
  }, []);

  const addToCart = async (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      let newCart;
      if (existing) {
        newCart = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      } else {
        newCart = [...prev, item];
      }
      localStorage.setItem("heedy_cart", JSON.stringify(newCart));
      return newCart;
    });

    const token = getToken();
    if (token) {
      try {
        await axios.post(`${getApiUrl()}/cart`, {
          productId: item.id,
          quantity: item.quantity,
          size: item.size
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to add to backend cart", err);
      }
    }
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return;
    setCartItems(prev => {
      const newCart = prev.map(i => i.id === id ? { ...i, quantity: qty } : i);
      localStorage.setItem("heedy_cart", JSON.stringify(newCart));
      return newCart;
    });

    const token = getToken();
    if (token) {
      try {
        await axios.put(`${getApiUrl()}/cart/item`, {
          productId: id,
          quantity: qty
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to update backend cart", err);
      }
    }
  };

  const removeItem = async (id: string) => {
    setCartItems(prev => {
      const newCart = prev.filter(i => i.id !== id);
      localStorage.setItem("heedy_cart", JSON.stringify(newCart));
      return newCart;
    });

    const token = getToken();
    if (token) {
      try {
        await axios.delete(`${getApiUrl()}/cart/item`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId: id }
        });
      } catch (err) {
        console.error("Failed to remove from backend cart", err);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem("heedy_cart");

    const token = getToken();
    if (token) {
      try {
        await axios.delete(`${getApiUrl()}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to clear backend cart", err);
      }
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
