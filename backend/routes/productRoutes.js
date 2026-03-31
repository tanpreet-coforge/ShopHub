const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/:id/reviews', auth, productController.addReview);

module.exports = router;
