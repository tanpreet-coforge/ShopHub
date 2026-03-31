const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  {
    name: 'Wireless Headphones Pro',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life and premium sound quality.',
    price: 199.99,
    originalPrice: 299.99,
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    stock: 50,
    sku: 'WHP-001',
    tags: ['electronics', 'audio', 'wireless'],
    rating: 4.5,
  },
  {
    name: 'Smart Watch Ultra',
    description:
      'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 7-day battery.',
    price: 349.99,
    originalPrice: 449.99,
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1579364848ae9a0b0d0?w=500&h=500&fit=crop',
    stock: 35,
    sku: 'SWU-001',
    tags: ['electronics', 'wearable', 'fitness'],
    rating: 4.7,
  },
  {
    name: 'Yoga Mat Premium',
    description:
      'High-density yoga mat with non-slip surface, perfect for yoga, pilates, and exercise.',
    price: 49.99,
    originalPrice: 79.99,
    category: 'Sports',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=500&fit=crop',
    stock: 100,
    sku: 'YMP-001',
    tags: ['sports', 'fitness', 'yoga'],
    rating: 4.3,
  },
  {
    name: 'Cotton T-Shirt Basics',
    description:
      'Comfortable 100% cotton t-shirt available in multiple sizes and colors.',
    price: 24.99,
    originalPrice: 39.99,
    category: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    stock: 150,
    sku: 'CTB-001',
    tags: ['fashion', 'clothing', 'casual'],
    rating: 4.2,
  },
  {
    name: 'Running Shoes Comfort',
    description:
      'Lightweight running shoes with cushioned soles for maximum comfort and support.',
    price: 119.99,
    originalPrice: 169.99,
    category: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    stock: 75,
    sku: 'RSC-001',
    tags: ['fashion', 'shoes', 'sports'],
    rating: 4.6,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description:
      'Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    price: 34.99,
    originalPrice: 49.99,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1602143407151-7e36dd5f5ded?w=500&h=500&fit=crop',
    stock: 120,
    sku: 'SWB-001',
    tags: ['home', 'outdoor', 'bottles'],
    rating: 4.4,
  },
  {
    name: 'The Great Gatsby',
    description:
      'Classic American novel by F. Scott Fitzgerald. A timeless story of wealth and love.',
    price: 12.99,
    originalPrice: 19.99,
    category: 'Books',
    image:
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&h=500&fit=crop',
    stock: 200,
    sku: 'TGG-001',
    tags: ['books', 'fiction', 'classic'],
    rating: 4.8,
  },
  {
    name: 'LEGO Building Set',
    description:
      'Creative building set with 500+ pieces. Great for kids and adults alike.',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Toys',
    image:
      'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500&h=500&fit=crop',
    stock: 60,
    sku: 'LEGO-001',
    tags: ['toys', 'building', 'creative'],
    rating: 4.9,
  },
  {
    name: 'Portable Phone Charger',
    description:
      '20000mAh portable power bank. Charges most phones 4-5 times. Fast charging support.',
    price: 39.99,
    originalPrice: 59.99,
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop',
    stock: 80,
    sku: 'PPC-001',
    tags: ['electronics', 'charging', 'portable'],
    rating: 4.5,
  },
  {
    name: 'Coffee Maker Deluxe',
    description:
      'Programmable coffee maker with 12-cup capacity. Brew timer and keep-warm function.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Home',
    image:
      'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop',
    stock: 45,
    sku: 'CMD-001',
    tags: ['home', 'kitchen', 'appliances'],
    rating: 4.3,
  },
  {
    name: 'Wireless Mouse Ergonomic',
    description:
      'Ergonomic wireless mouse with silent clicking. 18-month battery life.',
    price: 29.99,
    originalPrice: 49.99,
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
    stock: 110,
    sku: 'WME-001',
    tags: ['electronics', 'computer', 'peripheral'],
    rating: 4.4,
  },
  {
    name: 'Winter Jacket Warm',
    description:
      'Insulated winter jacket with water-resistant outer shell. Perfect for cold weather.',
    price: 149.99,
    originalPrice: 229.99,
    category: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
    stock: 55,
    sku: 'WJW-001',
    tags: ['fashion', 'clothing', 'winter'],
    rating: 4.6,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Seed a test user
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123', // Will be hashed by the model
    });

    await testUser.save();
    console.log('✅ Created test user');
    console.log('📧 Email: testuser@example.com');
    console.log('🔑 Password: password123');

    console.log('\n✨ Database seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
