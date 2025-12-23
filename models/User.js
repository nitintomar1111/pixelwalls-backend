const { ObjectId } = require("mongodb");

const User = {
  email: "",
  password: "",
  isAdmin: false,
  isPremium: false,
  createdAt: new Date()
};

module.exports = User;
