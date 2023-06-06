const Category = require('../models/Category');

const CategoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch category', message: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const newCategory = new Category({ name });
      const category = await newCategory.save();
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category', message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name });
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category', message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category', message: error.message });
    }
  },
};

module.exports = CategoryController;