const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./users")

const positionSchema = new Schema({
  symbol: String,
  shares: Number,
  avgCost: Number,
  fees: Number,
  currentPrice: Number,
  logo: String,
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;
