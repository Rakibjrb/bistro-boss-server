const express = require("express");
const app = express();
const cors = require("cors");
const {
  serverMainRoute,
  getMenus,
  getReviews,
  addToCart,
  getCartData,
  deleteCartItem,
  saveNewUser,
  getUsers,
  deleteUser,
  makeAdmin,
} = require("./controllers/controllers");
const { client } = require("./db/db");

//middleweres
app.use(express.json());
app.use(cors());

app.get("/", serverMainRoute);

const checkdb = async () => {
  try {
    client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    //server all get routes
    app.get("/api/v1/menus/:id", getMenus);
    app.get("/api/v1/reviews", getReviews);
    app.get("/api/v1/cart", getCartData);
    app.get("/api/v1/users", getUsers);

    //post routes
    app.post("/api/v1/cart", addToCart);
    app.post("/api/v1/users", saveNewUser);

    //put or patch routes
    app.patch("/api/v1/users/:id", makeAdmin);

    //all delete routes
    app.delete("/api/v1/cart/:id", deleteCartItem);
    app.delete("/api/v1/users/:id", deleteUser);
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
  }
};

checkdb();

module.exports = app;
