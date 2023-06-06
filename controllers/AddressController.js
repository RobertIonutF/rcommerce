const Address = require('../models/Address');

const AddressController = {
  createAddress: async (req, res) => {
    try {
      const { user, street, city, state, country, zipCode } = req.body;
      const newAddress = new Address({ user, street, city, state, country, zipCode });
      const address = await newAddress.save();
      res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create address', message: error.message });
    }
  },

  getAddressById: async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch address', message: error.message });
    }
  },

  updateAddress: async (req, res) => {
    try {
      const { user, street, city, state, country, zipCode } = req.body;
      const updatedAddress = await Address.findByIdAndUpdate(req.params.id, {
        user,
        street,
        city,
        state,
        country,
        zipCode,
      });
      if (!updatedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.json({ message: 'Address updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update address', message: error.message });
    }
  },

  deleteAddress: async (req, res) => {
    try {
      const deletedAddress = await Address.findByIdAndDelete(req.params.id);
      if (!deletedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.json({ message: 'Address deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete address', message: error.message });
    }
  },
};

module.exports = AddressController;