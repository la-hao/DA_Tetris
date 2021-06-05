const userModel = require('./rankBoardModel');

module.exports.getAll = () => {
    return userModel.find({});
}