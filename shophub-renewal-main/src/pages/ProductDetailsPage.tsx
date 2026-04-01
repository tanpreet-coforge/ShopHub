import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, ChevronLeft, Minus, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id!);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-shop py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-shop py-16 text-center">
        <h2 className="text-2xl font-heading text-foreground mb-4">Product not found</h2>
        <Button onClick={() => navigate("/products")} className="font-body">Back to Products</Button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      setQuantity(1);
    } catch {
      // handled in context
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="container-shop py-8">
      <Button variant="ghost" onClick={() => navigate("/products")} className="mb-6 font-body text-muted-foreground">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-2xl overflow-hidden bg-muted"
        >
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="text-xs text-primary font-body uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? "fill-primary text-primary" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-body">
              {product.rating || 0} ({product.reviewCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-heading font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through font-body">${product.originalPrice.toFixed(2)}</span>
                <Badge className="bg-primary text-primary-foreground font-body">-{discount}%</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground font-body leading-relaxed">{product.description}</p>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-body font-semibold text-foreground">Key Features</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((feature: string) => (
                  <li key={feature} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock */}
          <p className={`text-sm font-body font-semibold ${product.stock > 0 ? "text-success" : "text-destructive"}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "Out of Stock"}
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-input rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-muted transition-colors rounded-l-lg"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 font-body font-semibold text-foreground min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 hover:bg-muted transition-colors rounded-r-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="flex-1 font-body"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {adding ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
