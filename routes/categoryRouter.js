const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const validateApiKey = require('../middleware/validatekey');
const adminCheck = require('../middleware/adminCheck');

router.get('/', validateApiKey, CategoryController.getAllCategories);
router.get('/:id', validateApiKey, CategoryController.getCategoryById);
router.post('/', adminCheck, validateApiKey, CategoryController.createCategory);
router.put('/:id', adminCheck, validateApiKey, CategoryController.updateCategory);
router.delete('/:id', adminCheck, validateApiKey, CategoryController.deleteCategory);

module.exports = router;