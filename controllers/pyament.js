const { errorResponse } = require("../utilities/utilities");

require("dotenv").config();
const stripe = require("stripe")(process.env.VITE_STRIPE_CLIENT_SECRETE);

const paymentIntents = async (req, res) => {
  const { price } = req.body;
  const total = parseInt(price * 100);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.send(errorResponse());
  }
};

module.exports = paymentIntents;
