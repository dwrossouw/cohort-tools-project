// Load environment variables from the project's .env file when available.
try {
  process.loadEnvFile();
} catch (error) {
  // The server can continue with environment values supplied by the host.
  console.warn(".env file not found, using default environment values");
}

// Import Express and define the local server port.
const express = require("express");

// Connect to MongoDB before the Express application starts handling requests.
require("./db");

// Initialize the Express application.
const app = express();

// Apply shared middleware configuration, such as CORS and JSON parsing.
const addConfig = require("./config");
addConfig(app);

// Mount the application route definitions.
const indexRouter = require("./routes/index.routes.js");
app.use(indexRouter);

// Register centralized error-handling middleware.
const handleErrors = require("./errors");
handleErrors(app);

// Serve the API documentation page.
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// Return a custom not-found page for unmatched requests.
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/views/not-found.html");
});

// Start listening for incoming HTTP requests.
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
