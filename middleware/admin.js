const verifyToken = require("./auth");

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Admin access only ❌"
      });
    }
    next();
  });
};

module.exports = verifyAdmin;
