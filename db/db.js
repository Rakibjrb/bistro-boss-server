const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e9dao1z.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const menusCollection = client.db("bistroDB").collection("menus");
const reviewsCollection = client.db("bistroDB").collection("reviews");
const cartCollection = client.db("bistroDB").collection("cart");
const userCollection = client.db("bistroDB").collection("users");

module.exports = {
  client,
  ObjectId,
  menusCollection,
  reviewsCollection,
  cartCollection,
  userCollection,
};
