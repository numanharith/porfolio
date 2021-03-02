const express = require("express");
const users = express.Router();
const User = require("../models/users.js"); // require users model
const bcrypt = require("bcrypt");

// Routes to sign up page
users.get("/new", (req, res) => {
  res.render("users/new.ejs");
});

// Create account according to user's input
users.post("/", (req, res) => {
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err);
    }
    console.log(createdUser);
    res.redirect("/");
  });
});

module.exports = users;
