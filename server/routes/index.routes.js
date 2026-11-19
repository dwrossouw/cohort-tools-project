const { Router } = require("express")
const router = Router()

const cohortRouter = require("./cohorts.routes")
router.use( cohortRouter)

const studentRouter = require("./students.routes")
router.use( studentRouter)



module.exports = router