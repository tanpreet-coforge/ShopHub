import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, isLoading, fetchCart, updateCartItem, removeFromCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container-shop py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-heading text-foreground mb-2">Login Required</h2>
        <p className="text-muted-foreground font-body mb-6">Please login to view your cart</p>
        <Button onClick={() => navigate("/login")} className="font-body">Go to Login</Button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-shop py-16 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-heading text-foreground mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground font-body mb-6">Add products to continue shopping</p>
        <Button onClick={() => navigate("/products")} className="font-body">Continue Shopping</Button>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (error: any) {
      // handled in context
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error: any) {
      // handled in context
    }
  };

  return (
    <div className="container-shop py-8">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 bg-card rounded-xl border border-border p-4"
            >
              {item.productId && (
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-24 h-24 rounded-lg object-cover shrink-0 cursor-pointer"
                  onClick={() => navigate(`/products/${item.productId._id}`)}
                />
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-body font-semibold text-foreground text-sm cursor-pointer hover:text-primary transition-colors line-clamp-1"
                  onClick={() => item.productId && navigate(`/products/${item.productId._id}`)}
                >
                  {item.productId?.name || "Product"}
                </h3>
                <p className="text-xs text-muted-foreground font-body mt-1">{item.productId?.category}</p>
                <p className="text-lg font-heading font-bold text-foreground mt-2">${item.price.toFixed(2)}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-input rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 hover:bg-muted transition-colors rounded-l-lg disabled:opacity-50"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 py-1.5 font-body text-sm font-semibold text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="p-1.5 hover:bg-muted transition-colors rounded-r-lg"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24">
          <h3 className="font-heading font-bold text-foreground text-lg mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm font-body">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-base">
              <span>Total</span>
              <span className="font-heading">${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="w-full mt-6 font-body"
            size="lg"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
