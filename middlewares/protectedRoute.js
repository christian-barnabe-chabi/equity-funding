const jwt = require("jsonwebtoken");
const User = require("../src/models/User");

/**
 *
 * middleware use to protect routes for administrations actions
 * It just check if token is valid and the user exists - no thing else is handle here
 *
 * req.user gets the User's id
 */
const protectedRoute = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const APP_SECRET = process.env.APP_SECRET;

  try {
    var tokenData = jwt.verify(token, APP_SECRET);

    req.authId = tokenData.id;

    next();
  } catch (err) {
    res.status(401).json({ error: "Not authenticated", errorData: err });
  }
};

/**
 *
 * Middleware to get authenticated user detail from the database
 * It should normally be used after the protectedRoute middleware
 * Ideally in sub-routes and should also be used when you sure you need authenticated user's data
 *
 * req.user gets the User object at this level
 */
const authenticatedUserDetail = async (req, res, next) => {
  const user = await User.findOne({ where: { id: req.authId } }).catch(
    (error) => {
      throw new Error(error);
    }
  );

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  req.user = user;
  next();
};

module.exports = {
  protectedRoute,
  authenticatedUserDetail,
};
