const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const validateApiKey = require('../middleware/validatekey');
const adminCheck = require('../middleware/adminCheck');

router.get('/:userId', adminCheck, validateApiKey, CartController.getCartByUser);
router.put('/:userId', adminCheck, validateApiKey, CartController.updateCart);

module.exports = router;