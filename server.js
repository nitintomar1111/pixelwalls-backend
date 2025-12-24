const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/**
 * ✅ CORS CONFIG (RENDER FIX)
 */
app.use(cors({
  origin: [
    "https://pixel-walls.com",
    "https://www.pixel-walls.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ VERY IMPORTANT: preflight support
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/payments", require("./routes/payment.routes"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("PixelWalls Backend is running 🚀");
});

const PORT = process.env.PORT || 10000; // Render uses dynamic port
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
