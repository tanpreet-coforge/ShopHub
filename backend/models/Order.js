const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        productName: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'bank-transfer'],
      default: 'credit-card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: String,
    estimatedDelivery: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
