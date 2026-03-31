const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// All cart routes require authentication
router.use(auth);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:id', cartController.updateCartItem);
router.delete('/remove/:id', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);

module.exports = router;
