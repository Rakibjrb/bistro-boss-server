const {
  menusCollection,
  connectdb,
  closedb,
  ObjectId,
  reviewsCollection,
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
    await connectdb();
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
  } finally {
    await closedb();
  }
};

const getReviews = async (req, res) => {
  try {
    await connectdb();
    const reviews = await reviewsCollection.find({}).toArray();
    res.send(reviews);
  } catch (e) {
    console.log(e);
    res.send(errorResponse());
  }
};

module.exports = { serverMainRoute, getMenus, getReviews };
