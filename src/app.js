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
    origin: "*", // 🔥 Allow requests from any origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow all headers
    credentials: false, // 🔥 Disable credentials (Cookies/Authentication headers)
  })
);

// ✅ Handle Preflight Requests (Important for CORS)
app.options("*", cors());

// Middleware setup
app.use(express.json());

// ✅ Set Headers Globally for Full CORS Support
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // 🔥 Allow all origins
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/v1", Routes);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
