const {
  menusCollection,
  ObjectId,
  reviewsCollection,
  cartCollection,
  userCollection,
} = require("../db/db");
const { errorResponse } = require("../utilities/utilities");

const serverMainRoute = (req, res) => {
  res.send({
    statusCode: 200,
    message: "Bistro Boss server is running fine",
  });
};

const getMenus = async (req, res) => {
  const reqId = req.params.id;
  try {
    if (reqId === "all") {
      const menus = await menusCollection.find({}).toArray();
      res.send(menus);
      return;
    }
    const options = { _id: new ObjectId(reqId) };
    const singleMenu = await menusCollection.findOne(options);
    res.send(singleMenu);
  } catch (e) {
    console.log(e);
    res.send(errorResponse());
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewsCollection.find({}).toArray();
    res.send(reviews);
  } catch (e) {
    console.log(e);
    res.send(errorResponse());
  }
};

const addToCart = async (req, res) => {
  const data = req.body;
  try {
    const item = await cartCollection.insertOne(data);
    res.send(item);
  } catch (e) {
    console.log(e);
    res.send(errorResponse());
  }
};

const deleteCartItem = async (req, res) => {
  const reqId = req.params.id;
  const user = req.query;
  const options = { _id: new ObjectId(reqId), useremail: user.email };
  try {
    const item = await cartCollection.deleteOne(options);
    res.send(item);
  } catch (e) {
    console.log(e);
    res.send(errorResponse());
  }
};

const getCartData = async (req, res) => {
  const user = req.query;
  const options = { useremail: user.email };
  try {
    const cartItems = await cartCollection.find(options).toArray();
    res.send(cartItems);
  } catch (e) {
    console.log(e);
    res.send(errorResponse());
  }
};

const saveNewUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  try {
    const isUserExist = await userCollection.findOne(query);
    if (isUserExist) {
      return res.send({ success: false, message: "User already exist" });
    }
    const saveUser = await userCollection.insertOne(user);
    res.send(saveUser);
  } catch (error) {
    console.log(error);
    res.send(errorResponse());
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userCollection.find({}).toArray();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.send(errorResponse());
  }
};

module.exports = {
  serverMainRoute,
  getMenus,
  getReviews,
  addToCart,
  getCartData,
  deleteCartItem,
  saveNewUser,
  getUsers,
};
