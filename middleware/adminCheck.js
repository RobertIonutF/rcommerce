const User = require('../models/User');

const adminCheck = async (req, res, next) => {
    const foundAdmin = await User.findOne({ isAdmin: true });

    if (!foundAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

module.exports = adminCheck;
