const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then((x) => console.log("Connected to Database."))
  .catch((err) => console.error("Error connecting to MongoDB", err));
