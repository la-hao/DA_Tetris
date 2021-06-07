const userModel = require('../models/user.model');
exports.checkExistUsername = async (username) => {
    const data = await userModel.find({ username });

    if (data == []) {
        return false;
    }
    return true;
}
