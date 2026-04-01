import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ShopProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id);
    } catch {
      // error handled in context
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => navigate(`/products/${product._id}`)}
      className="group cursor-pointer bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-body text-xs">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="font-body font-semibold text-foreground text-sm line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.floor(product.rating || 0) ? "fill-primary text-primary" : "text-muted"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground font-body ml-1">({product.reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-heading font-bold text-foreground">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through font-body">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Stock & Add to Cart */}
        <div className="flex items-center justify-between pt-1">
          <span className={`text-xs font-body ${product.stock > 0 ? "text-success" : "text-destructive"}`}>
            {product.stock > 0 ? "✓ In Stock" : "Out of Stock"}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="h-8 text-xs font-body"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
