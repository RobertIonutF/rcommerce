const exprress = require('express');
const router = exprress.Router();
const UserControllers = require('../controllers/UserController');
const validateKey = require('../middleware/validatekey');

router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.post("/forgotpassword", UserControllers.forgotPassword);
router.post("/resetpassword", UserControllers.resetPassword);
router.post("/addtocart", validateKey, UserControllers.addToCart);
router.post("/removefromcart", validateKey, UserControllers.removeFromCart);
router.post("/addaddress", validateKey, UserControllers.addAddress);
router.post("/updateaddress", validateKey, UserControllers.updateAddress);
router.post("/makeorder", validateKey, UserControllers.makeOrder);
router.post("/viewcart", validateKey, UserControllers.viewCart);

module.exports = router;