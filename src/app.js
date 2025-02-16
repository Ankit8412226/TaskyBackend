const express = require("express");
const http = require("http");
const cors = require("cors"); // Import cors
const Routes = require("./routes/index");
const dbConnect = require("./config/dbConnect");
const path = require("path");

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
dbConnect();

// Middleware setup
app.use(express.json());

// Enable CORS for localhost:5173 (Vite)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies & authentication headers
  })
);

app.use("/api/v1", Routes);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
