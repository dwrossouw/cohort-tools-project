const morgan = require("morgan");
const cors = require("cors");
const express = require("express");


function addConfig(app) {
  // import middelware
 
  // Cors

  app.use(
    cors({
      origin: ["http://localhost:5173"],
    }),
  );

  app.use(morgan("dev"));
  app.use(express.static("public"));
  app.use(express.json()); // recognize an incoming Request Object as a JSON Object
  app.use(express.urlencoded({ extended: false }));
}

module.exports = addConfig;
