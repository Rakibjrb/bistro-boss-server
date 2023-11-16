const {
  menusCollection,
  ObjectId,
  reviewsCollection,
  cartCollection,
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

const getCartData = async (req, res) => {
  const user = req.query;
  console.log(user);
  try {
    const cartItems = await cartCollection.find().toArray();
    res.send(cartItems);
  } catch (e) {
    console.log(e);
    res.send(errorResponse());
  }
};

module.exports = {
  serverMainRoute,
  getMenus,
  getReviews,
  addToCart,
  getCartData,
};
