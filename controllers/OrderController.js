const Order = require('../models/Order');

const OrderController = {
  createOrder: async (req, res) => {
    try {
      const { user, products, totalPrice, address } = req.body;
      const newOrder = new Order({ user, products, totalPrice, address });
      const order = await newOrder.save();
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order', message: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order', message: error.message });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { user: userEmail, products, totalPrice, status, address } = req.body;
      const orderId = req.params.id;
      
      // Find the order and check if it exists
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Check if the user's email matches the order's user email
      if (userEmail !== order.user.email) {
        return res.status(401).json({ error: 'Unauthorized. You do not have permission to modify this order.' });
      }

      // Update the order
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
        products,
        totalPrice,
        status,
        address,
      });
      res.json({ message: 'Order updated successfully', updatedOrder });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order', message: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { user: userEmail } = req.body;
      const orderId = req.params.id;
      
      // Find the order and check if it exists
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Check if the user's email matches the order's user email
      if (userEmail !== order.user.email) {
        return res.status(401).json({ error: 'Unauthorized. You do not have permission to delete this order.' });
      }

      // Delete the order
      await Order.findByIdAndDelete(orderId);
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order', message: error.message });
    }
  },
};

module.exports = OrderController;