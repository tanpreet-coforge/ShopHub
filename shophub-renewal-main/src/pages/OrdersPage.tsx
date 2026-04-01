import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { orderAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-shop py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-heading text-foreground mb-2">Login Required</h2>
        <p className="text-muted-foreground font-body mb-6">Please login to view your orders</p>
        <Button onClick={() => navigate("/login")} className="font-body">Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="container-shop py-8">
      <h1 className="text-3xl font-heading font-bold text-foreground mb-8">My Orders</h1>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground font-body mt-4">Loading orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Package className="h-4 w-4" />
                    <span className="text-xs font-body">Order ID</span>
                  </div>
                  <p className="text-sm font-body font-semibold text-foreground">{order.trackingNumber}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-body">Order Date</span>
                  </div>
                  <p className="text-sm font-body text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs font-body">Total</span>
                  </div>
                  <p className="text-sm font-heading font-bold text-foreground">${order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-xs font-body text-muted-foreground">Status</span>
                  <p className="text-sm font-body font-semibold text-primary capitalize mt-1">{order.orderStatus}</p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-body font-semibold text-foreground mb-2">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm font-body text-muted-foreground">
                        <span>{item.productId?.name || "Product"} × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-heading text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground font-body mb-6">Start shopping to see your orders here</p>
          <Button onClick={() => navigate("/products")} className="font-body">Browse Products</Button>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
