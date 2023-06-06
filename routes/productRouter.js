const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const validateApiKey = require('../middleware/validatekey');
const adminCheck = require('../middleware/adminCheck');

router.get('/', validateApiKey, ProductController.getAllProducts);
router.get('/:id', validateApiKey, ProductController.getProductById);
router.post('/', adminCheck, validateApiKey, ProductController.createProduct);
router.put('/:id', adminCheck, validateApiKey, ProductController.updateProduct);
router.delete('/:id', adminCheck, validateApiKey, ProductController.deleteProduct);

module.exports = router;

