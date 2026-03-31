import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts({ limit: 8 });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-amazon-blue to-blue-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to ShopHub
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Discover amazing products at unbeatable prices. Shop electronics, fashion, home goods, and more!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-amazon-orange text-black px-8 py-3 rounded font-semibold hover:bg-orange-600 transition inline-flex items-center gap-2"
          >
            Shop Now <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <button
              onClick={() => navigate('/products')}
              className="text-amazon-orange hover:text-orange-600 font-semibold inline-flex items-center gap-1"
            >
              View All <ChevronRight size={20} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={handleViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys'].map((category) => (
              <button
                key={category}
                onClick={() => navigate(`/products?category=${category}`)}
                className="bg-gray-100 hover:bg-amazon-orange hover:text-white p-6 rounded-lg text-center font-semibold transition"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Get your orders delivered quickly and safely</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-bold text-lg mb-2">Quality Products</h3>
            <p className="text-gray-600">Handpicked products from trusted sellers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-lg mb-2">Secure Checkout</h3>
            <p className="text-gray-600">Safe and secure payment processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};
