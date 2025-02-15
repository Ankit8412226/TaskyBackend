const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const Routes = require("./routes/index");
const dbConnect = require("./config/dbConnect");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Allow connections from any origin (for development)
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
dbConnect();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for HTTP requests
app.use("/api/v1", Routes);

// Set io instance in app for use in routes
app.set("socketio", io);

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`); // Log the connected client socket ID

  // Client will listen for 'disconnect' event
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
