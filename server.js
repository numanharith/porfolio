const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const session = require("express-session");
const Position = require("./models/positions.js");

// Configuration
const PORT = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;

// Configure database & database connection
mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

// Middlewares
// For using PUT and Delete methods
app.use(methodOverride("_method"));
// Parses info from input fields into an object
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect("/sessions/new");
  }
};

// Routes
const sessionsController = require("./controllers/sessions.js");
app.use("/sessions", sessionsController);

const userController = require("./controllers/users.js");
app.use("/users", userController);

app.get("/new", isAuthenticated, (req, res) => {
  res.render("new.ejs");
});

app.post("/", isAuthenticated, (req, res) => {
  Position.create(req.body, (err, newPosition) => {
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  Position.find({}, (err, allPositions) => {
    res.render("index.ejs", {
      currentUser: req.session.currentUser,
      positions: allPositions,
    });
  });
});

// GET show route
app.get("/:id", (req, res) => {
  Position.findById(req.params.id, (err, foundPosition) => {
    res.render("show.ejs", {
      position: foundPosition,
    });
  });
});

// GET edit route
app.get("/:id/edit", (req, res) => {
  Position.findById(req.params.id, (err, foundPosition) => {
    res.render("edit.ejs", {
      position: foundPosition,
    });
  });
});

// PUT route for edit
app.put("/:id/edit", (req, res) => {
  Position.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        symbol: req.body.symbol,
        shares: req.body.shares,
        avgCost: req.body.avgCost,
        fees: req.body.fees,
        currentPrice: req.body.currentPrice,
        logo: req.body.logo,
      },
    },
    (err, edited) => {
      res.redirect("/");
    }
  );
});

// DELETE route
app.delete("/:id", (req, res) => {
  Position.findByIdAndDelete(req.params.id, (err, deleted) => {
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log("auth happening on port", PORT));