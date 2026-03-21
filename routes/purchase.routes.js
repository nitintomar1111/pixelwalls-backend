const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");

/* SAVE PURCHASE */
router.post("/add", async (req, res) => {
  const { userId, wallpaperId } = req.body;

  try {
    const exists = await Purchase.findOne({ userId, wallpaperId });

    if (!exists) {
      await Purchase.create({ userId, wallpaperId });
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* GET USER PURCHASES */
router.get("/:userId", async (req, res) => {
  try {
    const mongoose = require("mongoose");

const purchases = await Purchase.find({
  userId: new mongoose.Types.ObjectId(req.params.userId)
});

    res.json(purchases);

  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = router;
