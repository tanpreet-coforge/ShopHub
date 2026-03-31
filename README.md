# E-Commerce Prototype

A full-stack e-commerce application prototype built with React, Express, and MongoDB. Inspired by Amazon.com, this application includes product listing, product details, shopping cart, user authentication, and checkout functionality.

## Features

- **Landing Page** - Hero section with featured products
- **Product Listing** - Browse and filter products with search
- **Product Details** - Detailed product information and reviews section
- **Shopping Cart** - Add/remove items, update quantities
- **User Authentication** - Sign up, login, logout with MongoDB
- **Checkout** - Multi-step checkout process
- **Responsive Design** - Mobile-friendly UI

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)
- Axios (API calls)
- Context API (state management)

### Backend
- Node.js
- Express.js
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- bcryptjs (password hashing)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas cloud)

## Installation & Setup

### 1. Clone/Download the project

```bash
cd Ecommerce
```

### 2. Install all dependencies

```bash
npm run install-all
```

This will install dependencies for both frontend and backend.

### 3. Database Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster and database
4. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

#### Option B: MongoDB Local Installation

1. Download and install MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Local connection string: `mongodb://localhost:27017/ecommerce`

### 4. Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

JWT_SECRET=your_jwt_secret_key_change_this
PORT=5000
NODE_ENV=development
```

### 5. Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Seed Database (Optional)

To populate the database with sample products:

```bash
cd backend
npm run seed
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend (runs on http://localhost:5000)
npm run dev:backend

# Terminal 2 - Frontend (runs on http://localhost:5173)
npm run dev:frontend
```

### Production Build

```bash
npm run build
```

## Project Structure

```
Ecommerce/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context providers (Auth, Cart)
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API service calls
│   │   ├── styles/          # Global styles
│   │   └── App.jsx          # Main app component
│   └── package.json
│
├── backend/                  # Express backend
│   ├── routes/              # API routes
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── seeds/               # Database seed scripts
│   ├── server.js            # Express server entry point
│   └── package.json
│
├── package.json             # Root package.json
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product details
- `GET /api/products/search?q=keyword` - Search products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `POST /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order (checkout)
- `GET /api/orders/:id` - Get order details

## Default User Credentials (After Seeding)

For testing purposes, you can use:
- **Email:** testuser@example.com
- **Password:** password123

## Analytics Integration (Adobe Analytics)

This prototype includes placeholders for Adobe Analytics implementation:
- Page view tracking
- Product view tracking
- Add to cart events
- Checkout funnel tracking
- Search tracking

To integrate Adobe Analytics:
1. Add your Adobe Analytics library in `frontend/index.html`
2. Configure trackingIDs in `frontend/src/analytics/config.js`
3. Events are already structured and ready to be connected to your Adobe Analytics instance

## Deployment

### Frontend Deployment (Vercel)
```bash
# Push to GitHub, connect to Vercel
# Environment variables: VITE_API_URL=your_backend_url
```

### Backend Deployment (Heroku/Railway/Render)
```bash
# Set environment variables
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
NODE_ENV=production
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (local) or check your Atlas credentials
- Verify `MONGODB_URI` in `.env` file

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Vite will use the next available port

### CORS Issues
- Backend CORS is configured for `http://localhost:5173` in development
- Update `backend/server.js` corsOptions for production URLs

## Security Notes

⚠️ **This is a prototype for learning/testing purposes**

- Change `JWT_SECRET` to a strong, random string
- Use HTTPS in production
- Implement rate limiting on authentication routes
- Add input validation and sanitization
- Use environment variables for all sensitive data

## License

MIT

