const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
    username: String,
    histories: Array,

}, { collection: "history" });

module.exports = mongoose.model("history", historySchema);