// Password hashing and JWT generation are used for authentication.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create an Express router for the authentication endpoints.
const router = require("express").Router();

// Middleware that validates bearer tokens on protected routes.
const { verifyToken } = require("../middlewares/auth.middlewares");

// Mongoose model used to find and create user records.
const User = require("../models/User.model");

// Register a new user.
router.post("/signup", async (req, res) => {
  // Log the incoming request body while debugging.
  console.log(req.body);
  const { email, password, username } = req.body;

  // Both email and password are mandatory for account creation.
  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required" });
    return; // Stop processing after sending the validation response.
  }

  // Require a 6-20 character password with mixed case and at least one digit.
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{6,20}$/;
  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      message:
        "Password not strong enough. Needs min 6 characters, max 20 characters, at least one uppercase, one lowercase and one number",
    });
    return;
  }

  // Reject email values that do not contain the basic email format.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email) === false) {
    res.status(400).json({
      message: "Email address is not in the correct format.",
    });
    return;
  }

  // Prevent multiple accounts from using the same email address.
  const foundUser = await User.findOne({ email: email });
  if (foundUser) {
    res
      .status(400)
      .json({ message: "User already registered with that email" });
    return;
  }

  // Hash the password before storing it; never save the plain-text password.
  const passwordHash = await bcrypt.hash(password, 12);

  // Build the user data with the securely hashed password.
  const newUser = {
    email: email,
    password: passwordHash,
    username: username,
  };

  // Save the user and report successful account creation.
  await User.create(newUser);
  res.status(201).json({ message: "User created" });
});

// Authenticate an existing user and issue a login token.
router.post("/login", async (req, res) => {
  // Log the incoming request body while debugging.
  console.log(req.body);
  const { email, password } = req.body;

  // Reject requests that do not provide both login credentials.
  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required" });
    return;
  }

  // Look up the account associated with the submitted email.
  const foundUser = await User.findOne({ email: email });
  // Log the database result while debugging authentication.
  console.log(foundUser);
  if (!foundUser) {
    res.status(400).json({ message: "User not found with that email cohort!" });
    return;
  }

  // Compare the submitted password with the stored password hash.
  const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordCorrect) {
    res.status(400).json({ message: "Password not correct" });
    return;
  }

  // Include only the identity and role data needed by the client.
  const payload = {
    _id: foundUser._id,
    email: foundUser.email,
    role: foundUser.role,
  };

  // Sign a token that expires after seven days.
  const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });

  // Send the token and its payload back to the client.
  res.status(200).json({ authToken, payload });
});

// Verify the supplied token and return the authenticated payload.
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json(req.payload);
});

// Export the router so it can be mounted by the application.
module.exports = router;
