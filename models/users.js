const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: String,
  password: String,
  position: {
    type: Schema.Types.ObjectId,
    ref: "Position"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
