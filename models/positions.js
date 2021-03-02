const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./users.js");

const positionSchema = Schema({
  symbol: String,
  shares: Number,
  avgCost: Number,
  fees: Number,
  currentPrice: Number,
  logo: String,
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
