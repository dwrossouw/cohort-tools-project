// Create an Express router for user-related endpoints.
const router = require("express").Router();

// Require a valid authentication token before allowing access to protected routes.
const { verifyToken } = require("../middlewares/auth.middlewares")

const User = require("../models/User.model");


// Retrieve a user route for an authenticated user.
// verifyToken runs before the route handler and validates the bearer token.
router.get("/users/:id", verifyToken, async (req, res) => {
  // Log the decoded token payload for debugging and user identification.
  // console.log(req.payload) 

  // Confirm that the request reached a route protected by authentication.

const users = await User.findById(req.payload._id)


  //res.send("accesing route only for logged in users")
  res.status(200).json(users);
 // console.log(res.send);
})

// Export the router so it can be mounted by the application.
module.exports = router;