const express = require("express");
const app = express();
const cors = require("cors");
const {
  serverMainRoute,
  getMenus,
  getReviews,
  addToCart,
  getCartData,
} = require("./controllers/controllers");
const { client } = require("./db/db");

//middleweres
app.use(express.json());
app.use(cors());

//server all get routes
app.get("/", serverMainRoute);

const checkdb = async () => {
  try {
    client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.get("/api/v1/menus/:id", getMenus);
    app.get("/api/v1/reviews", getReviews);
    app.get("/api/v1/cart", getCartData);
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
  }
};

checkdb();

//post routes
app.post("/api/v1/cart", addToCart);

module.exports = app;
