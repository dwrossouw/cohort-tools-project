const mongoose = require("mongoose");
const MONGO_URI = "mongodb://127.0.0.1:27017/cohort-tools-api";

mongoose
  .connect(MONGO_URI)
  .then((x) => console.log("Connected to Database."))
  .catch((err) => console.error("Error connecting to MongoDB", err));
