const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
    username: String,
    userId: String,
    histories: Array,

}, { collection: "history" });

module.exports = mongoose.model("history", historySchema);