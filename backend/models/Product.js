const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Toys'],
    },
    image: {
      type: String,
      required: true,
    },
    images: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        rating: Number,
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
