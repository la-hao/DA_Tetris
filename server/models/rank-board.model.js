const mongoose = require('mongoose');
const { Schema } = mongoose;

const rankBoardSchema = new Schema({
    username: String,
    score: Number,
    time: String,

}, { collection: "rank" });

module.exports = mongoose.model("rank", rankBoardSchema);