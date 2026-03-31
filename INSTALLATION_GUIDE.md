# E-Commerce Prototype - Installation & Setup Guide

Complete step-by-step guide to get the application running on your machine.

## Prerequisites

Before you start, ensure you have:

- **Node.js**: v16+ (download from https://nodejs.org)
- **npm**: Comes with Node.js (verify: `npm --version`)
- **MongoDB**: Local or Atlas cloud (see DATABASE_SETUP.md)
- **Git**: (optional, for cloning)
- **Code Editor**: VS Code recommended

### Verify Installation:
```powershell
node --version      # Should be v16+
npm --version       # Should be v7+
```

---

## Option 1: MongoDB Atlas Setup (Recommended - 5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier)
4. Create database user
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
6. Save this for Step 3 below

**For detailed instructions**, see [DATABASE_SETUP.md](DATABASE_SETUP.md)

---

## Step-by-Step Installation

### 1. Clone / Download Project

If you have Git:
```bash
git clone <repository-url>
cd Ecommerce
```

Or download the ZIP file and extract to your desired location.

### 2. Install All Dependencies

```bash
# From project root directory
npm run install-all
```

This installs dependencies for both frontend and backend.

**What it does:**
- Installs root dependencies (concurrently)
- Installs backend dependencies
- Installs frontend dependencies

**Expected output:**
```
✓ backend dependencies installed
✓ frontend dependencies installed
✓ All installations complete
```

### 3. Configure Backend Database

**Create `.env` file in `backend/` directory:**

```powershell
cd backend
```

Create a new file `.env` with:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secret (change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here_2024

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**For local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

### 4. Seed Database with Sample Data

```bash
# From backend directory
npm run seed
```

This will:
- Create 12 sample products (Electronics, Fashion, Home, Sports, Books, Toys)
- Create test user: `testuser@example.com` / `password123`
- Populate default categories

**Expected output:**
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Seeded 12 products
✅ Created test user
✨ Database seeding completed successfully!
```

### 5. Configure Frontend Environment

**Create `.env` file in `frontend/` directory:**

```
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Option A: Run Both Frontend & Backend Together

```bash
# From project root directory
npm run dev
```

This starts:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173

### Option B: Run Separately (Easier Debugging)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on port 5000
📍 API: http://localhost:5000/api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE vX.X.X  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access Application:
Open browser and go to: **http://localhost:5173**

---

## First Time Setup Checklist

- [ ] Node.js and npm installed
- [ ] Project downloaded/cloned
- [ ] Dependencies installed (`npm run install-all`)
- [ ] MongoDB set up (Atlas or local)
- [ ] `.env` file created in `/backend`
- [ ] `.env` file created in `/frontend`
- [ ] Database seeded (`npm run seed`)
- [ ] Both servers running
- [ ] Application accessible at http://localhost:5173

---

## Testing the Application

### 1. Login with Test User
- **Email:** testuser@example.com
- **Password:** password123

### 2. Test Features:
- [ ] Browse landing page
- [ ] Search for products
- [ ] Filter by category
- [ ] View product details
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Proceed to checkout
- [ ] Complete order
- [ ] View order history

### 3. Create New User
- Go to Register page
- Create account with new email
- Practice full user flow

---

## API Testing (Optional)

Use Postman or Insomnia to test API endpoints:

### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123"
}
```

Response includes `token` - use in Authorization header for protected routes.

### Get All Products
```
GET http://localhost:5000/api/products?limit=12&page=1
```

### Search Products
```
GET http://localhost:5000/api/products/search?q=headphones
```

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org

### Issue: "MongoDB connection error"
**Solution:**
1. Verify MongoDB is running
2. Check connection string in `.env`
3. For Atlas: Verify IP is whitelisted
4. See DATABASE_SETUP.md for detailed help

### Issue: Port already in use (e.g., 5000 or 5173)
**Solution:** Change in `.env` files:
```env
# Backend - change PORT
PORT=3000

# Or kill existing process:
# Windows: netstat -ano | findstr :"PID"
#         taskkill /PID <PID> /F
# Mac/Linux: lsof -ti:5000 | xargs kill -9
```

### Issue: CORS errors in console
**Solution:** Ensure `.env` in frontend has correct API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### Issue: "Cannot find module..." errors
**Solution:** Reinstall dependencies:
```bash
# Delete node_modules
rm -r node_modules
rm package-lock.json

# Reinstall
npm run install-all
```

### Issue: Database is empty
**Solution:** Run seed script:
```bash
cd backend
npm run seed
```

### Issue: Login always fails
**Solution:**
1. Verify user exists in database
2. Check password is correct
3. Try with test user: testuser@example.com / password123
4. Create new user and login

---

## Project Structure

```
Ecommerce/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Header, Footer, ProductCard
│   │   ├── pages/         # Home, Products, Cart, Checkout, etc.
│   │   ├── context/       # Auth, Cart contexts
│   │   ├── services/      # API client
│   │   ├── hooks/         # useAuth, useCart
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/               # Express backend
│   ├── models/            # MongoDB schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, etc.
│   ├── seeds/             # Database seeding
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env.example
│
├── package.json           # Root scripts
├── DATABASE_SETUP.md      # Database guide
└── README.md             # Project overview
```

---

## Development Best Practices

### 1. **Keep `.env` files out of git:**
```bash
# Already in .gitignore, just don't commit them
```

### 2. **Create feature branches:**
```bash
git checkout -b feature/add-wishlist
```

### 3. **Use meaningful commit messages:**
```bash
git commit -m "Add product search functionality"
```

### 4. **Test thoroughly:**
- Try all user flows
- Test on different devices
- Check browser console for errors

### 5. **Code style:**
- Use consistent naming
- Add comments for complex logic
- Follow React/Express conventions

---

## Adding More Products

To add more sample products, edit `backend/seeds/seedDatabase.js`:

```javascript
const products = [
  {
    name: 'Your Product Name',
    description: 'Product description',
    price: 99.99,
    originalPrice: 149.99,
    category: 'Electronics',
    image: 'https://image-url.jpg',
    stock: 50,
    sku: 'UNIQUE-SKU-001',
    rating: 4.5,
  },
  // Add more products...
];
```

Then run:
```bash
npm run seed
```

---

## Deploying to Production

### Frontend Deployment (Vercel):
1. Push to GitHub
2. Connect to Vercel
3. Set environment variable: `VITE_API_URL=your-backend-url`

### Backend Deployment (Heroku/Railway/Render):
1. Set environment variables on hosting platform
2. Deploy code
3. Update frontend API URL

**See individual service documentation for detailed instructions.**

---

## Performance Optimization

### Frontend:
- Build for production: `npm run build`
- Use code splitting
- Lazy load images
- Minimize bundle size

### Backend:
- Add database indexes
- Implement caching
- Use pagination
- Optimize queries

### Database:
- Create indexes on frequently queried fields
- Archive old orders
- Implement backups

---

## Security Reminders

⚠️ **Before Production:**
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable CORS restrictions
- [ ] Use environment variables for all secrets
- [ ] Implement request validation
- [ ] Add proper error handling

---

## Useful Commands Reference

```bash
# Installation
npm run install-all              # Install all dependencies
npm install                      # Install specific directory deps

# Development
npm run dev                      # Run both frontend and backend
npm run dev:backend              # Run backend only
npm run dev:frontend             # Run frontend only

# Database
npm run seed                     # Seed database with sample data (from backend/)

# Production
npm run build                    # Build for production
npm run build:frontend           # Build frontend only
npm start                        # Run in production mode (from backend/)
```

---

## Next Steps

1. ✅ Complete setup (you're here!)
2. Explore the application
3. Test all features
4. Customize branding (logo, colors, name)
5. Add more products
6. Implement tracking for Adobe Analytics
7. Deploy to production

---

## Getting Help

- **MongoDB Questions:** DATABASE_SETUP.md
- **API Documentation:** See comments in `/backend/routes`
- **React/Tailwind:** See component files with detailed comments
- **Errors:** Check browser console (F12) and terminal output

---

## What's Included

✅ Full-stack CRUD application
✅ User authentication (JWT)
✅ Product catalog with search/filter
✅ Shopping cart functionality
✅ Multi-step checkout
✅ Order management
✅ Responsive design (Mobile-first)
✅ Sample data (12 products + test user)
✅ Error handling
✅ Security middleware

---

## Ready to Deploy?

Your application is production-ready! See production checklist and deployment guides for cloud hosting (Vercel, Railway, Heroku, etc.).

**Happy coding!** 🎉
