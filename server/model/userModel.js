const mongoose = require('mongoose');
const { Schema } = mongoose;

const users = new Schema(
    {
        username: String,
        password: String,
        highestScore: Number,
    },
    { collection: "users" }
);

module.exports = mongoose.model("users", users);
