const express = require("express");
const sessions = express.Router();
const User = require("../models/users.js");
const bcrypt = require("bcrypt");

// Routes to login page
sessions.get("/new", (req, res) => {
  res.render("sessions/new.ejs");
});

// Post request to add user data to sessions object
sessions.post("/", (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.send("oops something went wrong");
    } else if (!foundUser) {
      res.send("No such user found!");
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser;
        res.redirect("/");
      } else {
        res.send(`<a href="/">Wrong password</a>`);
      }
    }
  });
});

// Delete sessions route to log out of account
sessions.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = sessions;
