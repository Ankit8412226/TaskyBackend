const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authMiddleware = (req, res, next) => {
  // ✅ Allow CORS before checking token
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // ✅ Handle preflight requests for CORS
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  // ✅ Check if Authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = { _id: decoded.id || decoded._id }; // Ensure correct field name

    console.log("Decoded Token:", JSON.stringify(decoded));
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
