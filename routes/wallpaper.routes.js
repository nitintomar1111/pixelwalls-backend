const express = require("express");
const { MongoClient } = require("mongodb");
const verifyAdmin = require("../middleware/admin");


const router = express.Router();
const client = new MongoClient(process.env.MONGODB_URI);

// ADD WALLPAPER (basic)
router.post("/add", verifyAdmin, async (req, res) => {
  try {
    const { imageUrl, category, device, license } = req.body;

    if (!imageUrl || !category || !device) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await client.connect();
    const db = client.db("pixelwalls");
    const wallpapers = db.collection("wallpapers");

    await wallpapers.insertOne({
      imageUrl,
      category,
      device,
      license: license || "free",
      createdAt: new Date()
    });

    res.status(201).json({ message: "Wallpaper added ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add wallpaper ❌" });
  }
});

module.exports = router;

// GET ALL WALLPAPERS (public)
// GET WALLPAPERS (public + filters)
router.get("/", async (req, res) => {
  try {
    const { license, category, device } = req.query;

    await client.connect();
    const db = client.db("pixelwalls");
    const wallpapers = db.collection("wallpapers");

    const filter = {};

    if (license) {
      filter.license = license;
    }

    if (category) {
      filter.category = category;
    }

    if (device) {
      filter.device = device;
    }

    const results = await wallpapers.find(filter).toArray();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch wallpapers ❌" });
  }
});


const verifyToken = require("../middleware/auth");
const { ObjectId } = require("mongodb");

// DOWNLOAD CHECK
router.get("/download/:id", async (req, res) => {
  try {
    const wallpaperId = req.params.id;

    await client.connect();
    const db = client.db("pixelwalls");
    const wallpapers = db.collection("wallpapers");

    const wallpaper = await wallpapers.findOne({
      _id: new ObjectId(wallpaperId)
    });

    if (!wallpaper) {
      return res.status(404).json({ message: "Wallpaper not found ❌" });
    }

    // FREE wallpaper → allow download
    if (wallpaper.license === "free") {
      return res.json({
        message: "Free wallpaper – download allowed ✅",
        imageUrl: wallpaper.imageUrl
      });
    }

    // PREMIUM wallpaper → login required
    // PREMIUM wallpaper → login required
// Check token
const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({
    message: "Premium wallpaper – login required 🔒"
  });
}

// Verify token
verifyToken(req, res, () => {
  return res.json({
    message: "Premium wallpaper – download allowed ✅",
    imageUrl: wallpaper.imageUrl
  });
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Download failed ❌" });
  }
});
