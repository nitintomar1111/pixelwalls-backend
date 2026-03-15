const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/**
 * ✅ SAFE CORS CONFIG (RENDER + CASHFREE COMPATIBLE)
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

// ❌ DO NOT use app.options("*") — it crashes Render

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ROUTES
 */
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/wallpapers", require("./routes/wallpaper.routes"));

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
