const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const getAuthResponse = require("../../../helpers/getAuthResponse");

const databaseRegister = async (req, res, next) => {
  const requestData = req.body;

  const salt = await bcrypt.genSalt(10);
  requestData.password = await bcrypt.hash(requestData.password, salt);

  const user = await User.create(requestData).catch((error) => {
    throw new Error(error);
  })

  const APP_SECRET = process.env.APP_SECRET;
  const token = jwt.sign({ id: user.id }, APP_SECRET, {
    expiresIn: "7d",
  });

  const secondsInWeek = 604800;
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: secondsInWeek,
  });

  const authData = getAuthResponse(user, {token: token, expiresIn: "7d"});

  res.status(200).json(authData);
};

module.exports = databaseRegister;
