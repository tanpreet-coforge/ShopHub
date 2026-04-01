import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { orderAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { cart, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
    phone: user?.phone || "",
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "credit-card",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    if (!cart || cart.items.length === 0) {
      if (!orderId) navigate("/cart");
    }
  }, [isAuthenticated, cart]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        phone: formData.phone,
        paymentMethod: paymentData.paymentMethod,
      };
      const response = await orderAPI.createOrder(orderData);
      setOrderId(response.data.trackingNumber || response.data._id);
      await clearCart();
      setStep(3);
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="container-shop py-8 max-w-2xl mx-auto">
      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {["Shipping", "Payment", "Confirmation"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold ${
              step > i + 1 ? "bg-success text-success-foreground" :
              step === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {step > i + 1 ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm font-body hidden sm:inline ${step === i + 1 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl border border-border p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Shipping Address</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Street Address</label>
              <input type="text" name="street" value={formData.street} onChange={handleFormChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleFormChange} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleFormChange} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Postal Code</label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleFormChange} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleFormChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} className={inputClass} />
            </div>
            <Button className="w-full font-body mt-4" size="lg" onClick={() => setStep(2)}>
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Payment Details</h2>
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Name on Card</label>
              <input type="text" name="cardName" value={paymentData.cardName} onChange={handlePaymentChange} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Card Number</label>
              <input type="text" name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9012 3456" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">Expiry Date</label>
                <input type="text" name="expiryDate" value={paymentData.expiryDate} onChange={handlePaymentChange} placeholder="MM/YY" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-body font-semibold text-foreground mb-1.5 block">CVV</label>
                <input type="text" name="cvv" value={paymentData.cvv} onChange={handlePaymentChange} placeholder="123" className={inputClass} />
              </div>
            </div>

            {cart && (
              <div className="bg-muted rounded-lg p-4 mt-4 space-y-2">
                <h3 className="font-body font-semibold text-foreground text-sm">Order Summary</h3>
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm font-body text-muted-foreground">
                    <span>{item.productId?.name || "Product"} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground font-body">
                  <span>Total</span>
                  <span>${cart.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1 font-body" size="lg" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 font-body" size="lg" onClick={handleSubmitOrder} disabled={loading}>
                {loading ? "Placing Order..." : `Pay $${cart?.totalPrice.toFixed(2) || "0.00"}`}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle className="h-20 w-20 text-success mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground font-body mb-1">Your order has been placed successfully.</p>
            <p className="text-sm font-body text-muted-foreground mb-6">Order ID: <strong className="text-foreground">{orderId}</strong></p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/orders")} className="font-body">View Orders</Button>
              <Button onClick={() => navigate("/products")} className="font-body">Continue Shopping</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutPage;
