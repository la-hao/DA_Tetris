const userModel = require('../models/user.model');

module.exports.getAll = () => {
    return userModel.find({});
}