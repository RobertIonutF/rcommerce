const jwt = require('jsonwebtoken');

const generateAuthToken = (user) => {
    const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    
    return token;
}

const verifyAuthToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}

module.exports = 
{
    generateAuthToken,
    verifyAuthToken,
};