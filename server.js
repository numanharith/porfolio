const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const session = require("express-session");

// Configuration
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

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

// Routes

const sessionsController = require("./controllers/sessions.js");
app.use("/sessions", sessionsController);

const positionsController = require("./controllers/positions.js")
app.use("/", positionsController);

const userController = require("./controllers/users.js");
app.use("/users", userController);


app.listen(PORT, () => console.log("auth happening on port", PORT));
