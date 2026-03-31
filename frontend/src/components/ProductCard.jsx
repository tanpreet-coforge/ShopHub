import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useAuth';

export const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setAdding(true);
      await addToCart(product._id, quantity);
      setQuantity(1);
      alert('Added to cart!');
    } catch (error) {
      alert('Please login to add items to cart');
    } finally {
      setAdding(false);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer overflow-hidden flex flex-col h-full"
      onClick={() => onViewDetails(product._id)}
    >
      {/* Image Container */}
      <div className="relative bg-gray-200 h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded font-bold text-sm">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">(${product.price})</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-amazon-orange">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <p className={`text-xs mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? '✓ In Stock' : 'Out of Stock'}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding || isLoading}
          className="w-full bg-amazon-orange text-black py-2 rounded font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
