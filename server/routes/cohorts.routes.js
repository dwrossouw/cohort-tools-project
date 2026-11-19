const { Router } = require("express");
const router = Router();

const Cohort = require("../models/Cohort.model");

router.get("/cohorts", async (req, res, next) => {
  try {
    // Retrieve all cohort documents from MongoDB
    const cohorts = await Cohort.find();

    // Send the cohorts to the client as JSON
    res.json(cohorts);
  } catch (error) {
    // Pass any errors to Express error-handling middleware
    next(error);
  }
});
router.get("/cohorts/:cohortId", (req, res) => {
  Cohort.findById(req.params.cohortId)
    .then((cohort) => {
      res.status(201).json(cohort);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error getting cohort by id" });
    });
});

//Create a new cohort
router.post("/cohorts", (req, res) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
    .then((createdCohort) => {
      res.status(201).json(createdCohort);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error posting all cohort" });
    });
});

//Update cohort by ID
router.put("/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error updating cohort by id" });
    });
});

//Delete a chort by ID
router.delete("/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
    .then((deleteCohort) => {
      res.status(201).json(deleteCohort);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting cohort by id" });
    });
});

module.exports = router;
