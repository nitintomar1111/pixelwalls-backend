const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

/* =========================
   SIGNUP API
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({
  success: true,
  message: "Signup successful",
  user: {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email
  }
});

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

/* =========================
   LOGIN API
========================= */
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      "pixelwalls_secret",
      { expiresIn: "7d" }
    );

   res.json({
  success: true,
  message: "Login successful",
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email
  }
});

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});
module.exports = router;
