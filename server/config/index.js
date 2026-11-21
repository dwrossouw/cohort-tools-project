// Log HTTP requests during development.
const morgan = require("morgan");

// Enable cross-origin browser requests.
const cors = require("cors");

// Use Express helpers for static files and request-body parsing.
const express = require("express");

// Apply shared middleware settings to the Express application.
function addConfig(app) {
  // Allow the local frontend at this origin to access the API.
  app.use(
    cors({
      origin: ["http://localhost:5173"],
    }),
  );

  // Display concise request details in the server console.
  app.use(morgan("dev"));

  // Serve files from the public directory.
  app.use(express.static("public"));

  // Parse JSON request bodies and make them available on req.body.
  app.use(express.json());

  // Parse URL-encoded form submissions, without nested object parsing.
  app.use(express.urlencoded({ extended: false }));
}

// Export the configuration function for app.js.
module.exports = addConfig;
