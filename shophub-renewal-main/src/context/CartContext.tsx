import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { cartAPI } from "@/services/api";
import { toast } from "sonner";

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  cartItemsCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.addToCart({ productId, quantity });
      setCart(response.data.cart);
      toast.success("Added to cart!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to add to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCartItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.updateCartItem(itemId, { quantity });
      setCart(response.data.cart);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      const response = await cartAPI.removeFromCart(itemId);
      setCart(response.data.cart);
      toast.info("Item removed from cart");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to remove from cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      await cartAPI.clearCart();
      setCart(null);
    } catch (err) {
      console.error('Error clearing cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, isLoading, error, cartItemsCount, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
