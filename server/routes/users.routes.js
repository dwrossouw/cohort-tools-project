const router = require("express").Router();

const { verifyToken } = require("../middlewares/auth.middlewares")


router.get("/user", verifyToken, (req, res) => {
  console.log(req.payload) 

  res.send("accesing route only for logged in users")
})


module.exports = router;