const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5006;

const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

// STATIC DATA
// Import the provided files with JSON data of students and cohorts here:
// ...
// const students = require("./students.json")
// const cohorts = require("./cohorts.json")

// app.js

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Set up CORS middleware here:
// app.js
// Use the cors middleware without any options to allow
// requests from any IP address and domain.
// Use the CORS middleware with options to allow requests
// from specific IP addresses and domains.
app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ["http://localhost:5173"],
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Start working on the routes here:

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


// Get request using then/catch
// app.get("/students", (req, res) => {
//   Student.find({})
//     .then((Student) => {
//       console.log("Retrieved students ->", Student);
//       res.json(Student);
//     })
//     .catch((error) => {
//       console.error("Error while retrieving students ->", error);
//       res.status(500).json({ error: "Failed to retrieve students" });
//     });
// });

// GET all students
app.get("/students", async (req, res, next) => {
  try {
    // Retrieve all student documents from MongoDB
    const students = await Student.find();

    // Send the students to the client as JSON
    res.json(students);
  } catch (error) {
    // Pass any errors to Express error-handling middleware
    next(error);
  }
});



app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/views/not-found.html");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.post("/api/cohorts" , (req,res)=>{
Cohort.create({
  cohortSlug: req.body.cohortSlug,
  cohortName: req.body.cohortName,
  program:req.body.program,
  format:req.body.format,
  campus:req.body.campus,
  startDate:req.body.startDate,
  endDate:req.body.endDate,
  inProgress:req.body.inProgress,
  programManager:req.body.programManager,
  leadTeacher:req.body.leadTeacher,
  totalHours:req.body.totalHours,
})
.then((createdCohort)=>{
  res.status(201).json(createdCohort)
})
.catch((err)=>{
  res.status(500).json({message:"Error getting all cohort"})
})
})

// GET all cohorts
app.get("/api/cohorts", async (req, res, next) => {
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
 app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findById(req.params.id)
    .then((cohort) => {
     
  res.status(201).json(cohort)
    })
    .catch((err)=>{
  res.status(500).json({message:"Error getting cohort by id"})
})
});
app.put("/api/cohorts/:cohortId" ,(req,res)=>{
Cohort.findByIdAndUpdate(req.params.id,req.body,{new:true})
.then((updatedCohort)=>{
  res.status(201).json(updatedCohort)
})
 .catch((err)=>{
  res.status(500).json({message:"Error updating cohort by id"})
})
})
app.delete("/api/cohorts/:cohortId" ,(req,res)=>{
Cohort.findByIdAndDelete(req.params.id)
.then((deleteCohort)=>{
  res.status(201).json(deleteCohort)
})
 .catch((err)=>{
  res.status(500).json({message:"Error deleting cohort by id"})
})
})

//Student routes
//Create a new student
app.post("/api/students", async(req, res)=>{
  const newStudent = {
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email,
    phone: req.body.phone,
    linkedInUrl: req.body.linkedInUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects,
  }

  try {
    const student = await Student.create(newStudent);
    res.status(201).json(student);
  }
  catch (error){
    res.status(500).json({message: "Error while creating new student."})
  }
})

//Retrieve all of the students for a given cohort
app.get("api/students/:cohortId", async (req, res)=>{

}) 

//Retrieves a specific student by id
app.get("api/student/:studentId", async (req, res)=>{
  try {
    const student = await Student.findById(req.params.id);

    if(!student){
      res.status(404).json({message: "No student was found with that ID"})
    }
    else {
      res.status(200).json(student);
    }
  } catch (error) {
    res.status(500).json({message: "Error while retrieving student data."})
  }
})

//Update a specific student by ID
app.put("/api/students/:studentId", async (req, res)=> {
  try {
    const student = await Student.findByIdAndUpdate (req.params.id, req.body, {new: true, runValidators: true});

    if(!student){
      res.status(404).json({message: "No student was found with that ID"})
    }
    else {
      res.status(200).json(student);
    }

  } catch (error) {
     res.status(500).json({message: "Error while retrieving student data."})
  }
})

//Delete a specific student by ID
app.delete("/api/students/:studentId", async (req,res)=>{
  try {
    const student = await Student.findByIdAndDelete(req.params.id),

      if(!student){
      res.status(404).json({message: "No student was found with that ID"})
    }
    else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).json({message: "Error while deleting student data."})
  }
})
