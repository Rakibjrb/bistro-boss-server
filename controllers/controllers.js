const {
  menusCollection,
  ObjectId,
  reviewsCollection,
  cartCollection,
  userCollection,
  paymentsCollection,
} = require("../db/db");
const { errorResponse } = require("../utilities/utilities");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    res.send(errorResponse());
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewsCollection.find({}).toArray();
    res.send(reviews);
  } catch (e) {
    res.send(errorResponse());
  }
};

const addToCart = async (req, res) => {
  const data = req.body;
  try {
    const item = await cartCollection.insertOne(data);
    res.send(item);
  } catch (e) {
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
    res.send(errorResponse());
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userCollection.find({}).toArray();
    res.send(users);
  } catch (error) {
    res.send(errorResponse());
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const query = { _id: new ObjectId(userId) };
  try {
    const deleted = await userCollection.deleteOne(query);
    res.send(deleted);
  } catch (error) {
    res.send(errorResponse());
  }
};

const makeAdmin = async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  const query = { _id: new ObjectId(userId) };
  const updatedDoc = {
    $set: {
      role: data.role,
    },
  };
  try {
    const admin = await userCollection.updateOne(query, updatedDoc, {});
    res.send(admin);
  } catch (error) {
    res.send(errorResponse());
  }
};

const addItems = async (req, res) => {
  const data = req.body;
  try {
    const added = menusCollection.insertOne(data);
    res.send(added);
  } catch (error) {
    res.send(errorResponse());
  }
};

const createAccessToken = async (req, res) => {
  const userInfo = req.body;
  try {
    const token = jwt.sign(userInfo, process.env.TOKEN_SECRETE, {
      expiresIn: "1h",
    });
    res.send({ token });
  } catch (error) {
    res.send(errorResponse());
  }
};

const checkAdmin = async (req, res) => {
  try {
    const reqEmail = req.params.email;
    if (reqEmail !== req.decoded.email) {
      return res.status(403).send({ message: "unauthorized access" });
    }
    const user = await userCollection.findOne({ email: reqEmail });
    let admin = false;
    if (user) {
      admin = user.role === "Admin";
      res.send(admin);
    }
  } catch (error) {
    res.send(errorResponse());
  }
};

const deleteItem = async (req, res) => {
  const menuId = req.params.id;
  const query = { _id: new ObjectId(menuId) };
  try {
    const deletedItem = await menusCollection.deleteOne(query);
    res.send(deletedItem);
  } catch (error) {
    res.send(errorResponse());
  }
};

const updateMenu = async (req, res) => {
  const menuId = req.params.id;
  const data = req.body;
  const query = { _id: new ObjectId(menuId) };
  const updatedDoc = {
    $set: {
      name: data.name,
      category: data.category,
      price: data.price,
      recipe: data.recipe,
      image: data.image,
    },
  };
  try {
    const updated = await menusCollection.updateOne(query, updatedDoc);
    res.send(updated);
  } catch (e) {
    res.send(errorResponse());
  }
};

const payments = async (req, res) => {
  const { orderInfo } = req.body;
  const query = {
    _id: { $in: orderInfo.productIds.map((id) => new ObjectId(id)) },
  };
  try {
    const insertPaymentInfo = await paymentsCollection.insertOne(orderInfo);
    if (insertPaymentInfo) {
      const deleteItemFromCart = await cartCollection.deleteMany(query);
      res.send({ insertPaymentInfo, deleteItemFromCart });
    }
  } catch (error) {
    res.send(errorResponse());
  }
};

const getPayments = async (req, res) => {
  const email = req.params.email;
  try {
    const allPayments = await paymentsCollection.find({ email }).toArray();
    res.send(allPayments);
  } catch (error) {
    res.send(errorResponse());
  }
};

const adminStats = async (req, res) => {
  try {
    const users = await userCollection.estimatedDocumentCount();
    const orders = await paymentsCollection.estimatedDocumentCount();
    const menuItems = await menusCollection.estimatedDocumentCount();
    const result = await paymentsCollection
      .aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$price" },
          },
        },
      ])
      .toArray();

    const stats = {
      users,
      orders,
      menuItems,
      revenue: result.length > 0 ? result[0].totalRevenue : 0,
    };
    res.send(stats);
  } catch (error) {
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
  deleteUser,
  makeAdmin,
  createAccessToken,
  checkAdmin,
  addItems,
  deleteItem,
  updateMenu,
  payments,
  getPayments,
  adminStats,
};
