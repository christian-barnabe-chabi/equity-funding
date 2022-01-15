const jwt = require("jsonwebtoken");
const getAuthResponse = require("../../../helpers/getAuthResponse");
const User = require("../../models/User");
const bcrypt = require('bcryptjs');

const databaseLogin = async (req, res, next) => {
  const requestData = req.body;

  const user = await User.findOne({
    where: {email: requestData.email},
  }).catch((error) => {
      res.status(500).json({error: error});
      throw new Error(error);
    });

  if (!user) {
    return res
      .status(401)
      .json({ error: "L'adresse électronique saisie n'est pas dans notre registre" });
  }

  const isCorrectPassword = await bcrypt.compare(
    requestData.password,
    user.password
  );

  if (!isCorrectPassword) {
    return res
      .status(401)
      .json({ error: "Mot de passe incorrect. Veuillez réessayer" });
  }


  const APP_SECRET = process.env.APP_SECRET;
  const token = jwt.sign({ id: user.id }, APP_SECRET, {
    expiresIn: 604800,
  });

  const authData = getAuthResponse(user, {token: token, expiresIn: "7d"});
  
  res.status(200).json(authData);

};

module.exports = databaseLogin;
