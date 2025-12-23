const express = require("express");
const router = express.Router();
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// CREATE CASHFREE ORDER
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    // basic validation
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const orderId = "order_" + uuidv4();

    const payload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: "cust_" + uuidv4(),
        customer_name: "Test User",
        customer_email: "test@example.com",
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

module.exports = router;
