const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const validateApiKey = require('../middleware/validatekey');

router.get('/', validateApiKey, CategoryController.getAllCategories);
router.get('/:id', validateApiKey, CategoryController.getCategoryById);
router.post('/', validateApiKey, CategoryController.createCategory);
router.put('/:id', validateApiKey, CategoryController.updateCategory);
router.delete('/:id', validateApiKey, CategoryController.deleteCategory);

module.exports = router;