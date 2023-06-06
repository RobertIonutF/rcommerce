const Product = require('../models/Product');

const ProductController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product', message: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { title, description, price, quantity, category } = req.body;
      const newProduct = new Product({ title, description, price, quantity, category });
      const product = await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product', message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { title, description, price, quantity, category } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        title,
        description,
        price,
        quantity,
        category,
      });
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product', message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product', message: error.message });
    }
  },
};

module.exports = ProductController;