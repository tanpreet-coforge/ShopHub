import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useAuth';
import { useState } from 'react';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-amazon-dark text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-amazon-orange">
            ShopHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-amazon-orange transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-amazon-orange transition">
              Products
            </Link>
            {isAuthenticated && (
              <Link to="/orders" className="hover:text-amazon-orange transition">
                Orders
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-amazon-orange transition">
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amazon-orange text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm">{user?.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-amazon-orange text-black px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  to="/login"
                  className="bg-amazon-orange text-black px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amazon-blue text-white px-4 py-2 rounded hover:opacity-90 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <Link
              to="/"
              className="block py-2 hover:text-amazon-orange transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-2 hover:text-amazon-orange transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="block py-2 hover:text-amazon-orange transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 hover:text-amazon-orange transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-amazon-orange hover:opacity-80 transition"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-amazon-orange transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-amazon-orange transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
