const express = require("express");
const router = express.Router();
const axios = require("axios");
const Order = require("../models/Order");
const { v4: uuidv4 } = require("uuid");

// CREATE CASHFREE ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { amount, wallpaperId, userId } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const orderId = "order_" + uuidv4();

    await Order.create({
  orderId: orderId,
  wallpaperId: wallpaperId,
  userId: userId,      // ✅ ADD
  status: "PENDING"
});

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",

      // ✅ VERY IMPORTANT (REDIRECT FIX)
      order_meta: {
  return_url:
    "https://pixel-walls.com/index.html?order_id={order_id}"
},

      customer_details: {
        customer_id: "cust_" + uuidv4(),
        customer_name: "PixelWalls User",
        customer_email: "support@pixel-walls.com",
        customer_phone: "9999999999"
      }
    };

    const response = await axios.post(
      `${process.env.CASHFREE_BASE_URL}/orders`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error("Cashfree error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});
const Purchase = require("../models/Purchase");

router.get("/verify/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // 1️⃣ Find order
    const order = await Order.findOne({ orderId });

    console.log("ORDER DATA:", order);
console.log("USER ID:", order.userId);

    if (!order) {
      return res.json({ success: false });
    }

    // 2️⃣ Verify from Cashfree
    const response = await axios.get(
      `${process.env.CASHFREE_BASE_URL}/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      }
    );

    const paymentStatus = response.data.order_status;

    // 3️⃣ If paid → SAVE in MongoDB
    if (paymentStatus === "PAID") {

      const alreadyExists = await Purchase.findOne({
        userId: order.userId,
        wallpaperId: order.wallpaperId
      });

      if (!alreadyExists) {
        await Purchase.create({
          userId: order.userId,
          wallpaperId: order.wallpaperId
        });
      }

      // update order status
      order.status = "PAID";
      await order.save();

      return res.json({ success: true });

    } else {
      return res.json({ success: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
