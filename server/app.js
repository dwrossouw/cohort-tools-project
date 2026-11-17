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

// app.get("/api/students", (req, res) => {
//  res.json(students)
// });

// app.get("/api/cohorts", (req, res) => {
//  res.json(cohorts)
// });

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

// GET all cohorts
app.get("/cohorts", async (req, res, next) => {
  try {
    // Retrieve all cohort documents from MongoDB
    const cohorts = await Cohort.find();

    //Do we need this?
    // if (cohorts.length === 0) {
    //   return res.status(404).json({
    //     message: "Cohorts not found"
    //   });
    // }

    // Send the cohorts to the client as JSON
    res.json(cohorts);
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
