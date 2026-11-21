// Create an Express router for student endpoints.
const { Router } = require("express");
const router = Router();

// Import the Mongoose model used to access student records.
const Student = require("../models/Student.model");

// Retrieve all students from the database.
router.get("/students", async (req, res) => {
  const student = await Student.find();

  // Return a 404 if no matching student data is available.
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  // Send the retrieved students as JSON.
  res.status(200).json(student);
});

// Retrieve one student by ID and include its associated cohort data.
router.get("/student/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  const student = await Student.findById(studentId).populate("cohort");

  // Return a 404 when the requested student does not exist.
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  // Send the populated student document.
  res.status(200).json(student);
});

// Retrieve all students assigned to a specific cohort.
router.get("/students/cohort/:cohortId", async (req, res, next) => {
  const students = await Student.find({ cohort: req.params.cohortId });

  // Send the matching student records as JSON.
  res.json(students);
});

// Create a new student from the submitted request body.
router.post("/students", async (req, res) => {
  // Select the fields that should be stored in the new student document.
  const newStudent = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedInUrl: req.body.linkedInUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects,
  };

  // Insert the new student and return the created document.
  const student = await Student.create(newStudent);
  res.status(201).json(student);
});

// Update a specific student by ID.
router.put("/students/:studentId", async (req, res) => {
  // Apply the request body, return the updated document, and validate changes.
  const student = await Student.findByIdAndUpdate(
    req.params.studentId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  // Report whether the requested student was found.
  if (!student) {
    res.status(404).json({ message: "No student was found with that ID" });
  } else {
    res.status(200).json(student);
  }
});

// Delete a specific student by ID.
router.delete("/students/:studentId", async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.studentId);

  // Return 404 when no student matches the supplied ID.
  if (!student) {
    res.status(404).json({ message: "No student was found with that ID" });
  } else {
    // 204 indicates successful deletion without a response body.
    res.sendStatus(204);
  }
});

// Export the router so it can be mounted by the application.
module.exports = router;
