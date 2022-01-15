const {
  validateRequestOnUserDatabaseLogin,
  validateRequestOnUserDatabaseRegister,
  validateUserUniqueEmail,
} = require("../helpers/validators");
const {
  protectedRoute,
  authenticatedUserDetail,
} = require("../middlewares/protectedRoute");
const databaseLogin = require("../src/controllers/auth/loginController");
const databaseRegister = require("../src/controllers/auth/registerController");
const loadUser = require("../src/controllers/auth/loadUserController");
const logout = require("../src/controllers/auth/logout");
const router = require("express").Router();

/**
 * Auth user using the database
 *
 * @group authentication
 * @bodyParam {string} email required
 * @bodyParam {string} password required
 *
 * @unauthenticated
 */
router.post(
  "/login",
  validateRequestOnUserDatabaseLogin,
  databaseLogin
);

/**
 * Register users using the database
 *
 * @group authentication
 * @bodyParam {string} email required
 * @bodyParam {string} givenName required
 * @bodyParam {string} familyName required
 * @bodyParam {string} password required
 *
 * @unauthenticated
 */
router.post(
  "/register",
  validateRequestOnUserDatabaseRegister,
  validateUserUniqueEmail,
  databaseRegister
);

/**
 * Get authenticated user details
 *
 * @group authentication
 * 
 * @unauthenticated
 */
router.post("/user", protectedRoute, authenticatedUserDetail, loadUser);

/**
 * Logout the auth user
 *
 * @group authentication
 *
 * @unauthenticated
 */
router.post("/logout", logout);

module.exports = router;
