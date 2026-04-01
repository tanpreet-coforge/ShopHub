import React from "react";
import { Link } from "react-router-dom";

export const ShopFooter = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="container-shop py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-3">
              Shop<span className="text-primary">Hub</span>
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Discover curated products with exceptional quality. Your one-stop destination for thoughtful shopping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-foreground mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=Home+%26+Living" className="hover:text-primary transition-colors">Home & Living</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-body font-semibold text-foreground mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Register</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li className="hover:text-primary transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Shipping Info</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Returns</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground font-body">
          © {new Date().getFullYear()} ShopHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
