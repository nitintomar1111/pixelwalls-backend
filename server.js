const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/**
 * DATABASE CONNECTION
 */

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

/**
 * CORS
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
 * ROUTES
 */

app.use("/api/payments", require("./routes/payment.routes"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));

/**
 * HEALTH CHECK
 */

app.get("/", (req, res) => {
  res.send("PixelWalls Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
