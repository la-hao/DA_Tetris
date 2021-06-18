const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
        },
        process.env.JWT_SECRET || 'secret',
        {
            expiresIn: '30d'
        }
    )
}