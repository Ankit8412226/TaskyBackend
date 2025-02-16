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

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only localhost:5173
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and credentials
  })
);

app.use("/api/v1", Routes);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
