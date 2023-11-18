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
  createAccessToken,
  checkAdmin,
} = require("./controllers/controllers");
const { client } = require("./db/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middleweres
app.use(express.json());
app.use(cors());

app.get("/", serverMainRoute);

//middlewares for token verify
const verifyToken = (req, res, next) => {
  const requestToken = req.headers.authorization;
  if (!requestToken) {
    return res.status(401).send({ message: "forbidden access" });
  }
  const token = requestToken?.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRETE, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

const checkdb = async () => {
  try {
    client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    //user routes
    app.get("/api/v1/menus/:id", getMenus);
    app.get("/api/v1/reviews", getReviews);
    app.get("/api/v1/cart", getCartData);
    app.post("/api/v1/cart", addToCart);
    app.post("/api/v1/users", saveNewUser);
    app.post("/api/v1/access-token", createAccessToken);
    app.delete("/api/v1/cart/:id", deleteCartItem);

    //admin routes
    app.get("/api/v1/users/admin/:email", verifyToken, checkAdmin);
    app.get("/api/v1/users", verifyToken, getUsers);
    app.patch("/api/v1/users/:id", verifyToken, makeAdmin);
    app.delete("/api/v1/users/:id", verifyToken, deleteUser);
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
  }
};

checkdb();

module.exports = app;
