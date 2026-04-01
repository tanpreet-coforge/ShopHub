import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productAPI } from "@/services/api";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        limit: 12,
        sort: sortBy,
      };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await productAPI.getAllProducts(params);
      setProducts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat: string) => {
    const newCat = selectedCategory === cat ? "" : cat;
    setSelectedCategory(newCat);
    const params = new URLSearchParams(searchParams);
    if (newCat) params.set("category", newCat); else params.delete("category");
    setSearchParams(params);
  };

  return (
    <div className="container-shop py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          {selectedCategory || "All Products"}
        </h1>
        <p className="text-muted-foreground font-body">{products.length} products found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-body"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="py-2.5 px-3 rounded-lg border border-input bg-background text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick("")}
          className="font-body text-xs"
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(cat)}
            className="font-body text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-5 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ShopProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-heading text-foreground mb-2">No products found</p>
          <p className="text-muted-foreground font-body">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
