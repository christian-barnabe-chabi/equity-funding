const getAuthResponse = require("../../../helpers/getAuthResponse");
const User = require("../../models/User");

const loadUser = async (req, res, next) => {

  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  
  const authData = getAuthResponse(user, {token: req.cookies.token, expiresIn: "7d"});

  return res.status(200).json(authData);
};

module.exports = loadUser;
