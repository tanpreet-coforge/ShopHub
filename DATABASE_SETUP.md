# MongoDB Database Setup Guide

This guide will walk you through setting up MongoDB for the e-commerce application.

## Option 1: MongoDB Atlas (Cloud Database - Recommended)

MongoDB Atlas is a fully managed cloud database service. Perfect for development and production.

### Step-by-Step Setup:

#### 1. Create MongoDB Atlas Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Click "Sign Up" with email/GitHub
- Verify your email address
- Accept terms and create account

#### 2. Create a New Cluster
- Click "Build a Database"
- Choose cluster tier:
  - **Free Tier** (0.5GB) - Sufficient for prototyping ✅ Recommended
  - Shared Cluster
  - Dedicated Cluster
- Select cloud provider (AWS, Google Cloud, Azure) - doesn't matter for prototype
- Select region closest to you
- Click "Create Cluster" (will take 5-10 minutes)

#### 3. Create Database User
- Click "Database Access" in left menu
- Click "Add New Database User"
- Fill in:
  - **Username:** `ecommerce`
  - **Password:** Create a strong password (save this!)
  - **Role:** Atlas Admin (for now)
- Click "Add User"

#### 4. Whitelist Your IP
- Go to "Network Access" in left menu
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (127.0.0.1/32)
  - ⚠️ Only for development. Use specific IPs in production
- Click "Confirm"

#### 5. Get Connection String
- Go to "Clusters" in left menu
- Click "Connect" button
- Choose "Connect your application"
- Under "Drivers" select:
  - **Driver:** Node.js
  - **Version:** 4.1 or later
- Copy the connection string

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

Replace:
- `username` → your database user (e.g., `ecommerce`)
- `password` → your password (URL encode special chars)
- `cluster` → your cluster name (e.g., `cluster0`)
- `dbname` → database name (e.g., `ecommerce`)

**Example:**
```
mongodb+srv://ecommerce:MyPassword123@cluster0.abcd1234.mongodb.net/ecommerce?retryWrites=true&w=majority
```

#### 6. Add to Backend .env File
Create `.env` file in `backend/` directory:

```env
MONGODB_URI=mongodb+srv://ecommerce:MyPassword123@cluster0.abcd1234.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Option 2: Local MongoDB Installation

### Windows Installation:

#### 1. Download MongoDB Community
- Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Select:
  - **OS:** Windows
  - **Version:** Latest (6.0+)
  - **Package:** msi
- Click "Download"

#### 2. Install MongoDB
- Run the installer
- Accept license
- Choose "Complete" installation
- Install MongoDB as a Windows Service
- Leave defaults for data directory (`C:\Program Files\MongoDB\Server\X.X\data`)
- Click through and finish

#### 3. Verify Installation
```powershell
mongod --version
```

Should show version number.

#### 4. Start MongoDB Service
MongoDB should auto-start after installation.

To start manually:
```powershell
# Via MongoDB Compass (GUI)
# Download from https://www.mongodb.com/products/compass
# Or via command line:
mongod
```

#### 5. Create Database and User (Optional)
```powershell
# Open MongoDB shell in another terminal
mongosh

# Switch to admin database
use admin

# Create user
db.createUser({
  user: "ecommerce",
  pwd: "password123",
  roles: [{ role: "readWrite", db: "ecommerce" }]
})

# Verify
show users
```

#### 6. Connection String for Local MongoDB
```
mongodb://localhost:27017/ecommerce
```

Or with credentials:
```
mongodb://ecommerce:password123@localhost:27017/ecommerce
```

### Mac Installation (via Homebrew):

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

### Linux (Ubuntu) Installation:

```bash
# Import public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Verify
mongosh
```

---

## Database Architecture

### Collections (Tables):

#### 1. **Users** Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **Products** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  images: [String],
  rating: Number,
  reviews: [{
    userId: ObjectId,
    userName: String,
    rating: Number,
    comment: String,
    date: Date
  }],
  stock: Number,
  sku: String (unique),
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **Carts** Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, unique),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    addedAt: Date
  }],
  totalItems: Number,
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **Orders** Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  totalPrice: Number,
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Seeding Sample Data

The application includes a seed script to populate the database with sample products and a test user.

### Run Seed Script:

```bash
cd backend

# Install dependencies first if not done
npm install

# Run seed script
npm run seed
```

### Created Test User:
- **Email:** testuser@example.com
- **Password:** password123

### Sample Products:
12 products across categories:
- Electronics (Wireless Headphones, Smart Watch, Phone Charger, etc.)
- Fashion (T-Shirts, Running Shoes, Winter Jacket)
- Home (Water Bottle, Coffee Maker)
- Sports (Yoga Mat)
- Books (The Great Gatsby)
- Toys (LEGO Building Set)

---

## Database Indexes

For production, consider adding indexes:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Products
db.products.createIndex({ category: 1 })
db.products.createIndex({ name: "text", description: "text" })

// Carts
db.carts.createIndex({ userId: 1 }, { unique: true })

// Orders
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ createdAt: -1 })
```

---

## MongoDB Tools

### Recommended GUI Tools:

1. **MongoDB Compass** (Official)
   - Download: https://www.mongodb.com/products/compass
   - Visual database management
   - Query builder
   - Schema analysis

2. **MongoDB Atlas Web UI** (Cloud)
   - Included with Atlas
   - Browse collections
   - Create indexes
   - Monitor performance

3. **VS Code Extension**
   - Extension: "MongoDB for VS Code"
   - ID: `mongodb.mongodb-vscode`
   - Direct database access from VS Code

### Shell Access:

```bash
# For Atlas:
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"

# For Local:
mongosh
```

---

## Troubleshooting

### Connection Error: "Server selection timed out"
- **Cause:** IP not whitelisted (Atlas)
- **Solution:** Add your IP to Network Access in Atlas

### Connection Error: "Authentication failed"
- **Cause:** Wrong username/password
- **Solution:** Verify credentials, check URL encoding

### "Cannot connect to localhost:27017"
- **Cause:** MongoDB service not running (local)
- **Solution:** 
  - Windows: Check Services (mongod should be running)
  - Mac: `brew services list`
  - Linux: `sudo systemctl status mongod`

### Database Is Empty After Seeding
- Run seed script: `npm run seed`
- Check MongoDB is connected
- Verify database name in URI

---

## Security Checklist

✅ **Development:**
- Use free tier Atlas for development
- Add comprehensive IP whitelist
- Use strong passwords

✅ **Production:**
- Enable encryption in Atlas (paid only)
- Use encrypted connection strings
- Implement IP whitelist for specific IPs
- Use Firebase/AWS authentication for additional security
- Enable backups
- Use network isolation
- Implement rate limiting

---

## Backup & Recovery

### MongoDB Atlas Backups:
- Automatic daily snapshots (included)
- Access in "Backup" section
- Point-in-time restore available
- Download backup data

### Manual Backup (Local):
```bash
# Export data
mongodump --uri="mongodb://localhost:27017/ecommerce"

# Import data
mongorestore dump/
```

---

## Performance Optimization

For production:
1. Create indexes on frequently queried fields
2. Enable compression
3. Use connection pooling
4. Implement caching (Redis)
5. Monitor slow queries in Atlas

---

## Need Help?

- MongoDB Docs: https://docs.mongodb.com
- Atlas Docs: https://docs.atlas.mongodb.com
- Community: https://community.mongodb.com
- Stack Overflow: Tag `mongodb`
