const User = require('../models/User');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Add this line
const Address = require('../models/Address'); // Add this line
const nodemailer = require('nodemailer');
const token = require('../utils/token');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please fill all fields' });
      }

      const foundUser = await User.findOne({ email });

      if (foundUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        apiKey: '',
      });

      newUser.apiKey = token.generateAuthToken(newUser);

      const user = await newUser.save();

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to register user', message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: 'Please provide email and password' });
      }

      const user = await User.findOne({ email });

      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const apiKey = user.apiKey;

      res.json({ message: 'Login successful', apiKey });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to log in', message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Please provide an email' });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ACCOUNT,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      user.apiKey = token.generateAuthToken(user);
      await user.save();

      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: 'Password Reset',
        text: `The API key for your account has been sent: \n` + user.apiKey,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res
            .status(500)
            .json({ error: 'Failed to send password reset email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'Password reset email sent' });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to initiate password reset',
        message: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { apiKey, newPassword } = req.body;

      if (!apiKey || !newPassword) {
        return res
          .status(400)
          .json({ error: 'Please provide apiKey and newPassword' });
      }

      const user = await User.findOne({ apiKey });

      if (!user) {
        return res.status(401).json({ error: 'Invalid api key' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to change password', message: error.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const apiKey = req.headers['api-key'];
  
      const user = await User.findOne({ apiKey });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const cartItem = { product: productId, quantity };
      const cart = await Cart.findOne({ user: user._id });
  
      if (!cart) {
        const newCart = new Cart({
          user: user._id,
          products: [cartItem],
        });
        await newCart.save();
        user.cart = newCart._id;
      } else {
        cart.products.push(cartItem);
        await cart.save();
      }
  
      await user.save();
  
      res.json({ message: 'Product added to cart successfully' });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to add product to cart',
        message: error.message,
      });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.body;
      const apiKey = req.headers['api-key'];

      // Find the user based on the apiKey
      const user = await User.findOne({ apiKey });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the user's cart
      const cart = await Cart.findOne({ user: user._id });
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Find the product in the cart
      const product = cart.products.find(
        (item) => item.product.toString() === productId,
      );
      if (!product) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }

      // Reduce the quantity of the product by one
      if (product.quantity > 1) {
        product.quantity--;
      } else {
        // If the quantity is one, remove the product from the cart completely
        const productIndex = cart.products.findIndex(
          (item) => item.product.toString() === productId,
        );
        cart.products.splice(productIndex, 1);
      }

      await cart.save();

      res.json({ message: 'Product removed from cart successfully' });
    } catch (error) {
      res
        .status(500)
        .json({
          error: 'Failed to remove product from cart',
          message: error.message,
        });
    }
  },

  addAddress: async (req, res) => {
    try {
      const { street, city, state, country, zipCode } = req.body;
      const apiKey = req.headers['api-key'];

      // Find the user based on the apiKey
      const user = await User.findOne({ apiKey });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the user already has an address
      if (user.address) {
        // If the user already has an address, create a new address without replacing the existing on
        res.status(400).json({message: 'User already has an address'});
      } else {
        // If the user doesn't have an address, create a new address and assign it to the user
        const newAddress = new Address({
          user: user._id,
          street,
          city,
          state,
          country,
          zipCode,
        });
        const address = await newAddress.save();
        user.address = address;
        await user.save();
      }

      await user.save();

      res.status(201).json({ message: 'Address added successfully', address });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to add address', message: error.message });
    }
  },

  updateAddress: async (req, res) => {
    try {
      const { street, city, state, country, zipCode } = req.body;
      const apiKey = req.headers['api-key'];

      // Find the user based on the apiKey
      const user = await User.findOne({ apiKey });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.address) {
        return res.status(404).json({ error: 'User has no address' });
      }

      // Find the address associated with the user
      const address = await Address.findOne({ user: user._id });
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      // Update the address fields
      address.street = street;
      address.city = city;
      address.state = state;
      address.country = country;
      address.zipCode = zipCode;

      // Save the updated address
      await address.save();

      res.json({ message: 'Address updated successfully', address });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to update address', message: error.message });
    }
  },

  makeOrder: async (req, res) => {
    try {
      const apiKey = req.headers['api-key'];

      // Find the user based on the apiKey
      const user = await User.findOne({ apiKey });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the user's cart
      const cart = await Cart.findOne({ user: user._id });
      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Calculate the total price from the cart products
      let totalPrice = 0;
      cart.products.forEach((product) => {
        totalPrice += product.quantity * product.product.price;
      });

      // Create a new order for the user
      const newOrder = new Order({
        user: user._id,
        products: cart.products,
        totalPrice,
      });
      const order = await newOrder.save();

      // Clear the user's cart
      cart.products = [];
      await cart.save();

      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Failed to place order', message: error.message });
    }
  },

  viewCart: async (req, res) => {
    try {
      const apiKey = req.headers['api-key'];

      // Find the user based on the apiKey
      const user = await User.findOne({ apiKey });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the user's cart
      const cart = await Cart.findOne({ user: user._id }).populate('products.product', 'title price');

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cart', message: error.message });
    }
  },
};

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = UserController;
