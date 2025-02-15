const Task = require("../models/task.model");
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;

    // Input validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    // Validate deadline format
    if (deadline && !Date.parse(deadline)) {
      return res.status(400).json({
        message: "Invalid deadline format",
      });
    }

    // User validation
    if (!req.user?._id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const taskId = uuidv4();

    const newTask = new Task({
      userId: req.user._id,
      taskId,
      title,
      description,
      status: status || "pending",
      deadline,
      image: req.file?.filename || null,
      createdAt: new Date(),
    });

    const savedTask = await newTask.save();

    // Get Socket.IO instance
    const io = req.app.get("socketio");

    // Emit to all clients
    io.emit("newTask", {
      ...savedTask.toJSON(),
      message: "New task created",
    });

    // Emit specifically to the task creator
    io.to(req.user._id.toString()).emit("taskCreated", {
      success: true,
      task: savedTask,
    });

    console.log("New task created:", savedTask);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Get tasks by status (e.g., pending, in-progress, completed)
const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const tasks = await Task.find({ userId: req.user._id, status });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    res.status(500).json({ message: "Error fetching tasks by status", error });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, deadline } = req.body;

    const updatedFields = {};

    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (status) updatedFields.status = status;
    if (deadline) updatedFields.deadline = deadline;

    if (req.file && req.file.filename) {
      updatedFields.image = req.file.filename;
    }

    // Update the task with the provided fields
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updatedFields,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error });
  }
};

const generateTasksPdf = async (req, res) => {
  try {
    console.log("Generating PDF for user:", req.user._id); // Log user ID

    // Fetch tasks for the user
    const tasks = await Task.find({ userId: req.user._id });
    console.log("Fetched tasks:", tasks); // Log fetched tasks

    if (!tasks || tasks.length === 0) {
      console.log("No tasks found for the user.");
      return res.status(404).json({ message: "No tasks found for the user." });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set the file path for the PDF
    const filePath = path.join(__dirname, "tasks.pdf");
    console.log("Saving PDF to:", filePath); // Log file path

    // Create a write stream to write the PDF to the file
    const stream = fs.createWriteStream(filePath);

    // Pipe the document to the stream
    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(25).text("Task List", { align: "center" });
    doc.moveDown();

    tasks.forEach((task, index) => {
      console.log(`Adding task ${index + 1} to the PDF`);
      doc.fontSize(15).text(`Task ${index + 1}`);
      doc.text(`Task ID: ${task.taskId}`);
      doc.text(`Title: ${task.title}`);
      doc.text(`Description: ${task.description}`);
      doc.text(`Status: ${task.status}`);
      doc.text(`Deadline: ${task.deadline}`);
      doc.moveDown();
    });

    // Finalize the PDF and end the stream
    doc.end();

    // Handle the stream finish event
    stream.on("finish", () => {
      console.log("PDF generation complete. Sending file for download...");
      res.download(filePath, "tasks.pdf", (err) => {
        if (err) {
          console.error("Error downloading PDF:", err);
          return res.status(500).json({ message: "Error downloading PDF" });
        }

        console.log("PDF download successful. Deleting file...");
        // Delete the file after download
        fs.unlinkSync(filePath);
      });
    });

    // Handle stream error event
    stream.on("error", (err) => {
      console.error("Error during PDF streaming:", err);
      return res.status(500).json({ message: "Error generating PDF stream" });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF", error });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTasksByStatus,
  updateTask,
  deleteTask,
  generateTasksPdf,
};
