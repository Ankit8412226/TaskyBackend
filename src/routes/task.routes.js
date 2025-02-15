const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTasksByStatus,
  updateTask,
  deleteTask,
  generateTasksPdf,
} = require("../controllers/task.controllers");

router.post("/", authMiddleware, upload.single("image"), createTask);

router.get("/", authMiddleware, getTasks);

router.get("/:status", authMiddleware, getTasksByStatus);

router.put("/:id", authMiddleware, upload.single("image"), updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.get("/pdf", authMiddleware, generateTasksPdf);

module.exports = router;
