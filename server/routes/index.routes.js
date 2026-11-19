const { Router } = require("express")
const router = Router()

const cohortRouter = require("./cohorts.routes")
router.use("/api", cohortRouter)

const studentRouter = require("./students.routes")
router.use( "/api",studentRouter)



module.exports = router