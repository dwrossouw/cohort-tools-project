const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

const { verifyToken } = require("../middlewares/auth.middlewares");

const User = require("../models/User.model");

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email, password, username } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required" });
    return; // stop the route
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{6,20}$/;
  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      message:
        "Password not strong enough. Needs min 6 characters, max 20 characters, at least one uppercase, one lowercase and one number",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email) === false) {
    res.status(400).json({
      message: "Email address is not in the correct format.",
    });
    return;
  }

  const foundUser = await User.findOne({ email: email });
  if (foundUser) {
    res
      .status(400)
      .json({ message: "User already registered with that email" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = {
    email: email,
    password: passwordHash,
    username: username,
  };

  await User.create(newUser);
  res.status(201).json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required" });
    return;
  }

  const foundUser = await User.findOne({ email: email });
  console.log(foundUser);
  if (!foundUser) {
    res.status(400).json({ message: "User not found with that email cohort!" });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordCorrect) {
    res.status(400).json({ message: "Password not correct" });
    return;
  }

  const payload = {
    _id: foundUser._id,
    email: foundUser.email,
    role: foundUser.role,
  };

  const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({ authToken, payload });
});

router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
