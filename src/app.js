const express = require("express");
const http = require("http");
const cors = require("cors"); // Import cors
const Routes = require("./routes/index");
const dbConnect = require("./config/dbConnect");

const path = require("path");

const app = express();
const server = http.createServer(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
dbConnect();

// Middleware
const corsOptions = {
  origin: "*", // Allows all origins (both HTTP and HTTPS)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials if needed
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/v1", Routes);

// Middleware

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
