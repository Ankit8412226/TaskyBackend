const express = require("express");
const http = require("http");
const cors = require("cors");
const Routes = require("./routes/index");
const dbConnect = require("./config/dbConnect");
const path = require("path");

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
dbConnect();

// ✅ Allow All CORS Requests (Fully Open)
app.use(
  cors({
    origin: "*", // 🔥 Allow any frontend to access
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow authentication headers
    credentials: false, // Disable credentials (cookies)
  })
);

// ✅ Handle Preflight Requests (Fix for OPTIONS requests)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

// ✅ Ensure Headers are Set for Every Response
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(express.json());
app.use("/api/v1", Routes);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
