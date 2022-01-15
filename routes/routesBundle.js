const indexRouter = require("./index");
const usersRouter = require("./users");
const lendingsRouter = require("./lendings");
const authRouter = require('./auth');

module.exports = {
  indexRouter,
  usersRouter,
  authRouter,
  lendingsRouter,
};
