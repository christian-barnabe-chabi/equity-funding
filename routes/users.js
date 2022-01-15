const router = require("express").Router();
const {
  validateRequestOnUserCreate,
  validateUserUniqueEmail,
  validateRequestOnPermissionRevoke,
  validateRequestOnPermissionGrant,
  validateRequestOnUserUpdate,
  validateRequestOnUserChangePassword,
  validateRequestOnUserChangeRole,
  validateRequestOnLinkGoogle,
} = require("../helpers/validators");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  revokeUserPermission,
  setUserPermission,
  changeUserPassword,
  changeUserRole,
  unlinkGoogle,
  linkGoogle,
} = require("../src/controllers/usersController");

/**
 * Get Users
 *
 * @group Users
 * @method GET
 */
router.get("/", getUsers);

/**
 * Get User
 *
 * @group Users
 * @urlParam {ObjectId} id required
 */
router.get("/:id", getUser);

/**
 * Create User
 *
 * @group Users
 * @bodyParam {string} email required
 * @bodyParam {string} displayName required
 * @bodyParam {string} password required
 * @bodyParam {ObjectId} role required
 */
router.post(
  "/",
  validateUserUniqueEmail,
  validateRequestOnUserCreate,
  createUser
);

/**
 * Update User
 *
 * @group Users
 * @urlParam {ObjectId} id required
 * @bodyParam {string} displayName required
 */
router.put("/:id", validateRequestOnUserUpdate, updateUser);

/**
 * Revoke Permission
 * Revoke a permission on a module from an user
 *
 * @group Users
 * @bodyParam {ObjectId} module required
 * @bodyParam {ObjectId} user required
 */
router.post(
  "/permission/revoke",
  validateRequestOnPermissionRevoke,
  revokeUserPermission
);

/**
 * Grant Permission
 * Grant a permission on a module to an user
 *
 * @group Users
 * @bodyParam {ObjectId} module required
 * @bodyParam {ObjectId} user required
 * @bodyParam {string} accessCode required
 */
router.post(
  "/permission/grant",
  validateRequestOnPermissionGrant,
  setUserPermission
);

/**
 * Change password
 *
 * @group Users
 * @bodyParam {string} oldPassword required
 * @bodyParam {string} password required
 */
router.post(
  "/change-password",
  validateRequestOnUserChangePassword,
  changeUserPassword
);

/**
 * Change role
 *
 * @group Users
 * @bodyParam {ObjectId} role required
 * @bodyParam {ObjectId} user required
 */
router.post("/change-role", validateRequestOnUserChangeRole, changeUserRole);

/**
 * Delete User
 *
 * @group Users
 * @urlParam {ObjectId} id required
 */
router.delete("/:id", deleteUser);

router.post("/link-google", validateRequestOnLinkGoogle, linkGoogle);

router.post("/unlink-google", unlinkGoogle);

module.exports = router;
