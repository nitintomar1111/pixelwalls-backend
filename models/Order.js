const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  wallpaperId: String
});

module.exports = mongoose.model("Order", orderSchema);
