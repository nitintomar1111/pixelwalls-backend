const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const authRoutes = require("./routes/auth.routes");
const wallpaperRoutes = require("./routes/wallpaper.routes");




const app = express();
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
  }
}

connectDB();


// allow frontend to talk later
app.use(cors());
app.use(express.json());
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/wallpapers", wallpaperRoutes);



// test route
app.get("/", (req, res) => {
  res.send("PixelWalls Backend is running 🚀");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
