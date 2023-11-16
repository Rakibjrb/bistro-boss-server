const express = require("express");
const app = express();
const cors = require("cors");
const { serverMainRoute } = require("./controllers/controllers");

//middleweres
app.use(express.json());
app.use(cors());

//server all routes
app.get("/", serverMainRoute);

module.exports = app;
