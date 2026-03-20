const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/**
 * CORS CONFIG
 */
app.use(cors({
  origin: [
    "https://pixel-walls.com",
    "https://www.pixel-walls.com"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * CONNECT MONGODB
 */
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB Connected ✅");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

/**
 * ROUTES
 */

app.use("/api/payments", require("./routes/payment.routes"));
// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/wallpapers", require("./routes/wallpaper.routes"));

/**
 * HEALTH CHECK
 */

app.get("/", (req, res) => {
  res.send("PixelWalls Backend is running 🚀");
});

/**
 * DATABASE TEST ROUTE
 */

app.get("/test-db", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.send("MongoDB Connected ✅");
  } else {
    res.send("MongoDB NOT connected ❌");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
