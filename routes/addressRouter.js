const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const validateApiKey = require('../middleware/validatekey');

router.post('/', validateApiKey, AddressController.createAddress);
router.get('/:id', validateApiKey, AddressController.getAddressById);
router.put('/:id', validateApiKey, AddressController.updateAddress);
router.delete('/:id', validateApiKey, AddressController.deleteAddress);

module.exports = router;