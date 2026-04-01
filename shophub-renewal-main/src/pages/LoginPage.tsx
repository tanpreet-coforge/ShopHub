import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({ email: "testuser@example.com", password: "password123" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err: any) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl border border-border p-8">
          <h1 className="text-3xl font-heading font-bold text-foreground text-center mb-2">Welcome Back</h1>
          <p className="text-center text-muted-foreground font-body text-sm mb-6">Sign in to your ShopHub account</p>

          {(error || errors.submit) && (
            <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-lg mb-4">
              {error || errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {errors.email && <p className="text-destructive text-xs font-body mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {errors.password && <p className="text-destructive text-xs font-body mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full font-body" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-body mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </p>

          <div className="mt-4 bg-muted rounded-lg p-3 text-xs text-muted-foreground font-body text-center">
            <strong>Demo:</strong> testuser@example.com / password123
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
