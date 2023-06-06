const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const validateApiKey = require('../middleware/validatekey');
const adminCheck = require('../middleware/adminCheck');

router.post('/', adminCheck, validateApiKey, OrderController.createOrder);
router.get('/:id', adminCheck, validateApiKey, OrderController.getOrderById);
router.put('/:id', adminCheck, validateApiKey, OrderController.updateOrder);
router.delete('/:id', adminCheck, validateApiKey, OrderController.deleteOrder);

module.exports = router;