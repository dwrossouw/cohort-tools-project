const { Router } = require("express");
const router = Router();

const cohortRouter = require("./cohorts.routes");
router.use("/api", cohortRouter);

const studentRouter = require("./students.routes");
router.use("/api", studentRouter);

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

const userRouter = require("./users.routes");
router.use("/api", userRouter);

module.exports = router;
