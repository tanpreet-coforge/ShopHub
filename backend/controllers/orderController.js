const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new order (checkout)
exports.createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      items,
      totalPrice,
      paymentStatus,
    } = req.body;

    // Validation
    if (!shippingAddress || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create order
    const order = new Order({
      userId: req.userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      orderStatus: 'pending',
      trackingNumber: `ORD-${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await order.save();

    // Clear cart after successful order
    await Cart.updateOne(
      { userId: req.userId },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (order.orderStatus !== 'pending') {
      return res
        .status(400)
        .json({ message: 'Can only cancel pending orders' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
