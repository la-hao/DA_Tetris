const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.set('useCreateIndex', true);

const users = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        highestScore: Number,
    },
);

module.exports = mongoose.model("users", users);
