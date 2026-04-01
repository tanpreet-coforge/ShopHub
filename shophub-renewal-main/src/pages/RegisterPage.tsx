import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      await register(formData);
      navigate("/");
    } catch (err: any) {
      setErrors({ submit: err.message });
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8">
          <h1 className="text-3xl font-heading font-bold text-foreground text-center mb-2">Create Account</h1>
          <p className="text-center text-muted-foreground font-body text-sm mb-6">Join ShopHub today</p>

          {errors.submit && (
            <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-lg mb-4">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
                </div>
                {errors.firstName && <p className="text-destructive text-xs font-body mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
                </div>
                {errors.lastName && <p className="text-destructive text-xs font-body mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              {errors.email && <p className="text-destructive text-xs font-body mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} />
              </div>
              {errors.password && <p className="text-destructive text-xs font-body mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} />
              </div>
              {errors.confirmPassword && <p className="text-destructive text-xs font-body mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full font-body" size="lg" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-body mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
