const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,
  wallpaperId: String,

  userId: String,   // ✅ ADD THIS
  status: {
    type: String,
    default: "PENDING"
  }
});

module.exports = mongoose.model("Order", orderSchema);
