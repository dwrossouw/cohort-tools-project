const { Router } = require("express");
const router = Router();

const Cohort = require("../models/Student.model");

router.get("/api/student/:studentId", async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.isObjectIdOrHexString(studentId)) {
    return res.status(400).json({ error: "Invalid student ID" });
  }

  try {
    const student = await Student.findById(studentId).populate("cohort");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error while retrieving student:", error);
    res.status(500).json({ error: "Failed to retrieve student" });
  }
});

//Update a specific student by ID
router.put("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!student) {
      res.status(404).json({ message: "No student was found with that ID" });
    } else {
      res.status(200).json(student);
    }
  } catch (error) {
    res.status(500).json({ message: "Error while retrieving student data." });
  }
});

//Delete a specific student by ID
router.delete("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.studentId);

    if (!student) {
      res.status(404).json({ message: "No student was found with that ID" });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({ message: "Error while deleting student data." });
  }
});

module.exports = router;
