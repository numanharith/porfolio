const express = require("express");
const router = express.Router();
const Position = require("../models/positions.js");
const User = require("../models/users.js");

// API FOR RETRIEVING EOD STOCK PRICE
// const axios = require("axios");
// const accessKey = "70d478a1737b6120ed7824713e355d3b";
// const moment = require("moment");
// const date = moment().subtract(1, 'days').format("YYYY-MM-DD");

// const getPrice = (currentSymbol) => {
//   axios.get("http://api.marketstack.com/v1/eod" +
//   `?access_key=${accessKey}` +
//   `&symbols=${currentSymbol}` +
//   `&date_from=${date}`)
//   .then((response) => {
//     const apiResponse = response.data;
//     console.log(apiResponse.data[0].close)
//     return apiResponse.data[0].close;
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// };

// getPrice('AAPL');

// Verify that user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect("/users/new");
  }
};

// GET - Form page to create new position
router.get("/new", isAuthenticated, (req, res) => {
  res.render("new.ejs");
});

// POST - Creates new position
router.post("/", isAuthenticated, (req, res) => {
  const newPosition = {
    symbol: req.body.symbol,
    shares: req.body.shares,
    avgCost: req.body.avgCost,
    fees: req.body.fees,
    currentPrice: req.body.currentPrice,
    logo: req.body.logo,
    user: req.session.currentUser._id,
  };
  Position.create(newPosition, (err, createdPosition) => {
    res.redirect("/");
  });
});

// GET edit route
router.get("/:id/edit", (req, res) => {
  Position.findById(req.params.id, (err, foundPosition) => {
    res.render("edit.ejs", {
      position: foundPosition,
    });
  });
});

// PUT route for edit
router.put("/:id/edit", (req, res) => {
  Position.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        symbol: req.body.symbol,
        shares: req.body.shares,
        avgCost: req.body.avgCost,
        currentPrice: req.body.currentPrice,
        fees: req.body.fees,
        logo: req.body.logo,
      },
    },
    (err, edited) => {
      res.redirect("/");
    }
  );
});

// DELETE route
router.delete("/:id", (req, res) => {
  Position.findByIdAndDelete(req.params.id, (err, deleted) => {
    res.redirect("/");
  });
});

// GET show route
router.get("/:id", (req, res) => {
  Position.findById(req.params.id, (err, foundPosition) => {
    res.render("./positions/show.ejs", {
      position: foundPosition,
      currentUser: req.session.currentUser,
    });
  });
});

// User dashboard after login
router.get("/", isAuthenticated, (req, res) => {
  Position.find(
    { user: req.session.currentUser._id },
    (err, foundPositions) => {
      res.render("index.ejs", {
        currentUser: req.session.currentUser,
        positions: foundPositions,
      });
    }
  );
});

module.exports = router;
