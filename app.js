const express = require("express");
const app = express();
const cors = require("cors");
const {
  serverMainRoute,
  getMenus,
  getReviews,
} = require("./controllers/controllers");
const { checkdb } = require("./db/db");

//middleweres
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

//mongodb connection check
checkdb();

//server all get routes
app.get("/", serverMainRoute);
app.get("/api/v1/menus/:id", getMenus);
app.get("/api/v1/reviews", getReviews);

module.exports = app;
