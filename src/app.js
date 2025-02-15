const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const Routes = require("./routes/index");
const dbConnect = require("./config/dbConnect");

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
dbConnect();

// Middleware setup
app.use(express.json());
app.use(cors()); // Enable CORS for HTTP requests
app.use("/api/v1", Routes);

// Make io instance available throughout the application
app.set("socketio", io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Socket.IO server is running and listening for connections...");
});
