const mongoose = require('mongoose');
const { Schema } = mongoose;

const rankBoardSchema = new Schema({
    username: String,
    score: Number,

}, { collection: "rank" });

module.exports = mongoose.model("rank", rankBoardSchema);