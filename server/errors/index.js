function handleErrors(app) {

  // Handle requests that do not match any registered route.
  // This middleware returns a JSON 404 response.
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  // Handle unexpected application errors using Express's error middleware signature.
  app.use((error, req, res, next) => {
    // Express identifies middleware with four parameters as an error handler.
    console.log(error);

    // Return a generic 500 response while including the error for debugging.
    res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: error,
    });
  });

}

// Export the error setup function for use in app.js.
module.exports = handleErrors