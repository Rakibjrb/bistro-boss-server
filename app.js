const express = require("express");
const app = express();
const cors = require("cors");
const {
  serverMainRoute,
  getMenus,
  getReviews,
  addToCart,
} = require("./controllers/controllers");
const { checkdb } = require("./db/db");

//middleweres
app.use(express.json());
app.use(cors());

//mongodb connection check
checkdb();

//server all get routes
app.get("/", serverMainRoute);
app.get("/api/v1/menus/:id", getMenus);
app.get("/api/v1/reviews", getReviews);

//post routes
app.post("/api/v1/cart", addToCart);

module.exports = app;
