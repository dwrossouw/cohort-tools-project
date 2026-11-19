const express = require("express");
const PORT = 5006;

// app.js
require("./db")


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

const addConfig = require("./config")
addConfig(app)


const indexRouter = require("./routes/index.routes.js")
app.use(indexRouter)

const handleErrors = require("./errors")
handleErrors(app)



app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


//Page not found
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + "/views/not-found.html");
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
