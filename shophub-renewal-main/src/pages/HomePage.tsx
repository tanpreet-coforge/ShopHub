import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI } from "@/services/api";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Truck, Shield, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["Electronics", "Fashion", "Home & Living", "Sports", "Books", "Beauty"];

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts({ limit: 8 });
      setProducts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container-shop py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-primary font-body font-semibold text-sm uppercase tracking-widest mb-4">
              Curated Collections
            </p>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
              Discover Products You'll <span className="text-primary italic">Love</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed mb-8 max-w-lg">
              From everyday essentials to extraordinary finds. Shop curated collections with exceptional quality and unbeatable prices.
            </p>
            <div className="flex gap-3">
              <Button size="lg" onClick={() => navigate("/products")} className="font-body">
                Shop Now <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/products?category=Electronics")} className="font-body">
                Explore Electronics
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border bg-card">
        <div className="container-shop py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $50" },
              { icon: Shield, label: "Secure Payment", desc: "100% protected" },
              { icon: Sparkles, label: "Quality Assured", desc: "Curated products" },
              { icon: HeadphonesIcon, label: "24/7 Support", desc: "Always here to help" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-body font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-shop py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold text-foreground">Featured Products</h2>
          <Button variant="ghost" onClick={() => navigate("/products")} className="font-body text-primary">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-5 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ShopProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-secondary py-16">
        <div className="container-shop">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
                className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary hover:shadow-md transition-all duration-300 group"
              >
                <p className="font-body font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                  {cat}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
