const errorResponse = () => {
  return { statusCode: 500, message: "something went wrong" };
};

module.exports = { errorResponse };
