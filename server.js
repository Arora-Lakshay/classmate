const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const layout = require("express-ejs-layouts");
const path = require("path");
const createHttpError = require("http-errors");
require("dotenv").config();
require("./helpers/db.config");
require("./helpers/redis.config");

const app = express();

// Morgan for logging requests to console...
app.use(morgan('dev'));

// Cofiguring Cookie-Parser...
app.use(cookieParser());

// Populating the request bodies...
app.use(express.json());

// Accepting the form-data requests...
app.use(express.urlencoded({ extended: true }));

// Setting the public assets directory...
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Views Template Engine...
app.set('views', path.join(__dirname, 'src/views/'));

app.set("view engine", "ejs");

app.use(layout);

app.set('layout', path.join(__dirname, 'src/views/layouts/layout'));

// Routing goes here... 
app.use("/api/auth", require("./routes/auth.route"));

app.use("/api/in", require("./routes/api.route"));

app.use("/in", require("./routes/private.route"));

app.use("/", require("./routes/public.route"));

// Bad Routes! Hit a 404..
app.use(async (req, res, next) => {
  const options = {
    status: 404,
    title: "Looks like you're Lost",
    description: "The page you are looking for is not available !"
  }
  res.render("public/error", { title: "Page Not Found", style: "error", options });
});

// Error Handling...
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = {
    error: {
      status,
      message: err.message
    }
  }

  if (status >= 500) {
    console.log(`InternalServerError : ${err.message}`);
  }

  res.send(error);
});

// Configuring Express Server...
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
