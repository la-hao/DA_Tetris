const userModel = require('../models/user.model');

exports.checkExistUsername = async (username) => {
    const data = await userModel.findOne({ username: username });

    if (data) {
        return true;
    }
    return false;
}
