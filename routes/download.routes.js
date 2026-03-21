const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");

// 🔐 DOWNLOAD API
router.get("/:wallpaperId/:userId", async (req, res) => {
  const { wallpaperId, userId } = req.params;

  try {
    // 1️⃣ check if wallpaper is premium
    const isPremium = wallpaperId.includes("wp_"); // you can improve later

    if (!isPremium) {
      return res.json({ allowed: true });
    }

    // 2️⃣ check purchase
    const exists = await Purchase.findOne({
      userId,
      wallpaperId
    });

    if (!exists) {
      return res.status(403).json({
        allowed: false,
        message: "Not purchased"
      });
    }

    // 3️⃣ allow download
    res.json({ allowed: true });

  } catch (err) {
    res.status(500).json({ allowed: false });
  }
});

module.exports = router;
