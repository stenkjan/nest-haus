'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for selections and cart items
export interface CartItem {
  id: string;
  nest: {
    value: string;
    name: string;
    price: number;
    description: string;
  };
  gebaeudehuelle?: {
    value: string;
    name: string;
    price: number;
    description?: string;
  };
  innenverkleidung?: {
    value: string;
    name: string;
    price: number;
    description?: string;
  };
  fussboden?: {
    value: string;
    name: string;
    price: number;
    description?: string;
  };
  paket?: {
    value: string;
    name: string;
    price: number;
    description?: string;
  };
  fenster?: {
    value: string;
    name: string;
    price: number;
    description?: string;
    squareMeters: number;
  };
  pvanlage?: {
    value: string;
    name: string;
    price: number;
    description?: string;
    quantity: number;
  };
  totalPrice: number;
  timestamp: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  updateCartItem: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Clear cart on mount
  useEffect(() => {
    try {
      // Clear localStorage cart
      localStorage.removeItem('cart');
      // Ensure state is empty
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart on mount', error);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save cart to localStorage when it changes with error handling
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage', error);
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    try {
      setCartItems(prevItems => [...prevItems, item]);
    } catch (error) {
      console.error('Error adding item to cart', error);
    }
  };

  const removeFromCart = (itemId: string) => {
    try {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from cart', error);
    }
  };

  const clearCart = () => {
    try {
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  };

  const getCartTotal = () => {
    try {
      return cartItems.reduce((total, item) => total + item.totalPrice, 0);
    } catch (error) {
      console.error('Error calculating cart total', error);
      return 0;
    }
  };

  const getCartCount = () => {
    try {
      return cartItems.length;
    } catch (error) {
      console.error('Error getting cart count', error);
      return 0;
    }
  };

  const updateCartItem = (updatedItem: CartItem) => {
    try {
      setCartItems(prevItems => {
        const index = prevItems.findIndex(item => item.id === updatedItem.id);
        if (index === -1) {
          // Add new item
          return [...prevItems, updatedItem];
        }
        // Only update if the item is actually different
        if (JSON.stringify(prevItems[index]) !== JSON.stringify(updatedItem)) {
          const newItems = [...prevItems];
          newItems[index] = updatedItem;
          return newItems;
        }
        // No change, return previous state
        return prevItems;
      });
    } catch (error) {
      console.error('Error updating cart item', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        updateCartItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 