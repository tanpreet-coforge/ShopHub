import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-amazon-dark text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold mb-4">About ShopHub</h3>
          <p className="text-gray-400 text-sm">
            Your trusted online marketplace for quality products at great prices.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li><a href="#" className="hover:text-amazon-orange transition">About Us</a></li>
            <li><a href="#" className="hover:text-amazon-orange transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-amazon-orange transition">Careers</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Policies</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li><a href="#" className="hover:text-amazon-orange transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-amazon-orange transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-amazon-orange transition">Return Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">Contact</h3>
          <p className="text-gray-400 text-sm">
            📧 support@shophub.com<br />
            📞 1-800-SHOP-HUB<br />
            🏢 123 Commerce Street, NY
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-8">
        <p className="text-center text-gray-400 text-sm">
          © 2024 ShopHub. All rights reserved. | E-Commerce Prototype for Adobe Analytics Implementation
        </p>
      </div>
    </footer>
  );
};
