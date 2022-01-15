require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const chalk = require("chalk");
const cors = require('cors');

const {
  indexRouter,
  usersRouter,
  lendingsRouter,
  authRouter,
} = require("./routes/routesBundle");

const { protectedRoute } = require("./middlewares/protectedRoute");

const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// check connexion with the database
/*
app.use(async (req, res, next) => {
  const sequelize = await db();

  try {
    await sequelize.authenticate();
    console.log(
      chalk.greenBright("Connection has been established successfully.")
    );
    next();
  } catch (error) {
    console.error(
      chalk.redBright("Unable to connect to the database")
    );
  }
});
*/

app.use(cors());
// app.use(cors({origin: "*", exposedHeaders: "*", credentials: true}));
// app.use(cors({origin: "https://clever-davinci-940e10.netlify.app", exposedHeaders: "*", credentials: true}));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * @hideFromApiDocs
 */
app.use("/v1/", indexRouter);

/**
 * Route for administration
 */

// login route for user
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", protectedRoute, usersRouter);
app.use("/api/v1/lendings", protectedRoute, lendingsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send({error: "Not Found"});
});

// error handler
app.use(function (err, req, res, next) {
  //only providing error in development
  const message =
    process.env.NODE_ENV === "DEVELOPMENT"
      ? err.message
      : "Oups! Something went wrong";
  res.status(err.status || 500).json({
    message: message,
  });
});

module.exports = app;
