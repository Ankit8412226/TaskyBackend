const express = require("express");
const http = require("http");
const cors = require("cors"); // Import cors
const Routes = require("./routes/index");
const dbConnect = require("./config/dbConnect");
const socketIO = require("socket.io");
const path = require("path");

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
dbConnect();

// Connect to MongoDB
dbConnect();

// Middleware
app.use(express.json());

app.use("/api/v1", Routes);

const corsOptions = {
  origin: "*", // Allow connections from any origin
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Middleware
app.use(cors(corsOptions));
// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
