const jwt = require("jsonwebtoken");

const User = require("../models/user.models");
const { sendErrorResponse } = require("../middleware/errorHandler");
const { sendWelcomeEmail } = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  console.log(req.body, "created");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, "Email already exists");
    }

    const user = new User({ name, email, password });
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 400, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendErrorResponse(res, 400, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user,
      message: "Logged in successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  loginUser,
};
