const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  userId: String,
  wallpaperId: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Purchase", purchaseSchema);
