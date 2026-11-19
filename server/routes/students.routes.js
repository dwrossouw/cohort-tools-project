const { Router } = require("express");
const router = Router();

const Student = require("../models/Student.model");



router.get("/students", async (req, res) => {
 
  

    const student = await Student.find()

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  
});

router.get("/student/:studentId", async (req, res) => {
  const  studentId  = req.params.studentId;

  // if (!mongoose.isObjectIdOrHexString(studentId)) {
  //   return res.status(400).json({ error: "Invalid student ID" });
  // }

  
    const student = await Student.findById(studentId).populate("cohort");

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  
});

//Update a specific student by ID
router.put("/students/:studentId", async (req, res) => {
  
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
  
});

//Delete a specific student by ID
router.delete("/students/:studentId", async (req, res) => {

    const student = await Student.findByIdAndDelete(req.params.studentId);

    if (!student) {
      res.status(404).json({ message: "No student was found with that ID" });
    } else {
      res.sendStatus(204);
    }
  
});

module.exports = router;
