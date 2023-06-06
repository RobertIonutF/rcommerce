const exprress = require('express');
const router = exprress.Router();
const UserControllers = require('../controllers/UserController');

router.post('/register', UserControllers.register);
router.post('/login', UserControllers.login);
router.post("/forgot-password", UserControllers.forgotPassword);
router.post("/reset-password", UserControllers.resetPassword);

module.exports = router;