// Create an Express router for user-related endpoints.
const router = require("express").Router();

// Require a valid authentication token before allowing access to protected routes.
const { verifyToken } = require("../middlewares/auth.middlewares")

// Retrieve a user route for an authenticated user.
// verifyToken runs before the route handler and validates the bearer token.
router.get("/user/:id", verifyToken, (req, res) => {
  // Log the decoded token payload for debugging and user identification.
  console.log(req.payload) 

  // Confirm that the request reached a route protected by authentication.
  res.send("accesing route only for logged in users")
})

// Export the router so it can be mounted by the application.
module.exports = router;