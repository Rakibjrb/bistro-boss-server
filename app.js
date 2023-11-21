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
  addItems,
  deleteItem,
  updateMenu,
  payments,
  getPayments,
} = require("./controllers/controllers");
const { client, userCollection } = require("./db/db");
const jwt = require("jsonwebtoken");
const { errorResponse } = require("./utilities/utilities");
const paymentIntents = require("./controllers/pyament");
require("dotenv").config();

//middleweres
app.use(express.static("public"));
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

const verifyAdmin = async (req, res, next) => {
  const decodedEmail = req.decoded.email;
  const query = { email: decodedEmail };
  try {
    const user = await userCollection.findOne(query);
    if (user.role !== "Admin") {
      return res.status(403).send({ message: "access denied" });
    }
    next();
  } catch (error) {
    res.send(errorResponse());
  }
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
    app.get("/api/v1/cart", verifyToken, getCartData);
    app.get("/api/v1/payments", verifyToken, getPayments);
    app.post("/api/v1/cart", verifyToken, addToCart);
    app.post("/api/v1/create-payment-intents", verifyToken, paymentIntents);
    app.post("/api/v1/payments", verifyToken, payments);
    app.post("/api/v1/users", saveNewUser);
    app.post("/api/v1/access-token", createAccessToken);
    app.delete("/api/v1/cart/:id", verifyToken, deleteCartItem);

    //admin routes
    app.get("/api/v1/users/admin/:email", verifyToken, checkAdmin);
    app.get("/api/v1/users", verifyToken, verifyAdmin, getUsers);
    app.post("/api/v1/add-items", verifyToken, verifyAdmin, addItems);
    app.patch("/api/v1/users/:id", verifyToken, verifyAdmin, makeAdmin);
    app.delete("/api/v1/users/:id", verifyToken, verifyAdmin, deleteUser);
    app.delete("/api/v1/delete-menu/:id", verifyToken, verifyAdmin, deleteItem);
    app.put("/api/v1/menus/:id", verifyToken, verifyAdmin, updateMenu);
  } catch (e) {
    console.log(e);
  } finally {
    // client.close();
  }
};

module.exports = { app, checkdb };
