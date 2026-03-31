import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: 'testuser@example.com',
    password: 'password123',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amazon-blue to-blue-700 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Login</h1>
        <p className="text-gray-600 text-center mb-4 text-sm">
          Demo credentials: testuser@example.com / password123
        </p>

        {(error || errors.submit) && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
            {error || errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <div className="flex items-center gap-2 border rounded px-3 py-2">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="flex-1 outline-none"
              />
            </div>
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <div className="flex items-center gap-2 border rounded px-3 py-2">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="flex-1 outline-none"
              />
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amazon-orange text-black py-2 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50 mt-6"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-amazon-orange font-semibold hover:underline">
            Register here
          </Link>
        </p>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <p className="font-semibold mb-2">Demo Account:</p>
          <p>Email: testuser@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};
