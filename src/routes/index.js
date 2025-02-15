const express = require("express");
const authRoute = require("./use.routes");
const TaskRoutes = require("./task.routes");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/task", TaskRoutes);
// router.use('/users', userRoute);

module.exports = router;
