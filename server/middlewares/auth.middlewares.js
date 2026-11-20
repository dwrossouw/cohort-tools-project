const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {

  try {
    
    const authToken = req.headers.authorization.split(" ")[1]

    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)

    req.payload = payload // passing the payload into the request

    next()

  } catch (error) {
    
    // the token is not valid
    // the token doesn't exist
    // the token has expired
    res.status(401).json({message: "Token not valid or doesn't exist"})

  }

}

module.exports = {
  verifyToken

}

