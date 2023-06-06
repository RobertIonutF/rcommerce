const Cart = require('../models/Cart');

const CartController = {
  getCartByUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart', message: error.message });
    }
  },

  updateCart: async (req, res) => {
    try {
      const { user: userId, products } = req.body;
      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { products },
        { new: true }
      );
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.json({ message: 'Cart updated successfully', cart });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update cart', message: error.message });
    }
  },
};

module.exports = CartController;