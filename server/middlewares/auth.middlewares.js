// JSON Web Token library used to validate authentication tokens.
const jwt = require("jsonwebtoken")

// Validate a bearer token and pass its decoded payload to the route handler.
function verifyToken(req, res, next) {

  try {
    // Read the Authorization header and extract the token after "Bearer".
    const authToken = req.headers.authorization.split(" ")[1]

    // Verify the token signature and ensure it has not expired.
    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)

    // Store the decoded payload on the request for downstream route handlers.
    req.payload = payload

    // Continue to the protected route because authentication succeeded.
    next()

  } catch (error) {
    // Handle missing, malformed, invalid, or expired tokens.
    res.status(401).json({message: "Token not valid or doesn't exist"})

  }

}

// Export the middleware for use in protected routes.
module.exports = {
  verifyToken

}

