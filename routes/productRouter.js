const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const validateApiKey = require('../middleware/validatekey');

router.get('/', validateApiKey, ProductController.getAllProducts);
router.get('/:id', validateApiKey, ProductController.getProductById);
router.post('/', validateApiKey, ProductController.createProduct);
router.put('/:id', validateApiKey, ProductController.updateProduct);
router.delete('/:id', validateApiKey, ProductController.deleteProduct);

module.exports = router;

