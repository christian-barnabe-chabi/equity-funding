const { check, validationResult } = require("express-validator");
const User = require("../src/models/User");

const validateStrongPassword = [
  check(
    "password",
    "Please enter a valid and strong password - The password should be at least 10 length - it should contain at least 1 symbols, 1 uppercase caracher and 1 number"
  ).isStrongPassword({
    minLength: 10,
    minSymbols: 1,
    minUppercase: 1,
    minNumbers: 1,
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnUserCreate = [
  check("email", "Please enter a valid address email").isEmail(),
  check("givenName", "Please enter a given name").not().isEmpty(),
  check("familyName", "Please enter a family name").not().isEmpty(),
  check("role", "Please set user role").not().isEmpty(),
  ...validateStrongPassword,
];

const validateRequestOnUserUpdate = [
  check("email", "Please enter a valid address email").isEmail(),
  check("givenName", "Please enter a given name").not().isEmpty(),
  check("familyName", "Please enter a family name").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnUserChangePassword = [
  check("oldPassword", "Old password not defined").not().isEmpty(),
  ...validateStrongPassword,
]

const validateRequestOnUserChangeRole = [
  check("role", "User role not defined").not().isEmpty(),
  check("user", "User not defined").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateUserUniqueEmail = [
  check("email", "Email in use").custom((value) => {
    console.log(value);
    return User.findOne({where: { email: value }}).then((user) => {
      if (user) {
        return Promise.reject(`Sorry, ${user.email} is already in use. If ${user.email} is yours, try to sign in with it`);
      }
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

//  FIXME ---
const validateUserUniqueEmailOnUpdate = [
  check("email", "Email in use").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject(`Sorry, ${user.email} is already in use. If ${user.email} is yours, try to sign in with it`);
      }
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnUserRoleCreate = [
  check("label", "Please enter the role label").not().isEmpty(),
  check("displayLabel", "Please enter the role display label").not().isEmpty(),
  check("modules", "Please define the role's default modules")
    .not()
    .isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnUserRoleUpdate = [
  check("label", "Please enter the role label").not().isEmpty(),
  check("displayLabel", "Please enter the role display label").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnModuleCreate = [
  check("moduleName", "Please enter the module name")
    .not()
    .isEmpty(),
  check("description", "Please enter the module description")
    .not()
    .isEmpty(),
  check("defaultAccessCode", "Please enter the module default accessCode").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnModuleUpdate = [
  check("description", "Please enter the module description")
    .not()
    .isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];


const validateRequestOnPermissionRevoke = [
  check("module", "Please enter the module")
    .not()
    .isEmpty(),
  check("user", "Please enter the user")
    .not()
    .isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnPermissionGrant = [
  check("module", "Please enter the module")
    .not()
    .isEmpty(),
  check("user", "Please enter the user")
    .not()
    .isEmpty(),
  check("accessCode", "Please enter the access code")
    .not()
    .isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    next();
  },
];

const validateRequestOnUserDatabaseLogin = [
  check("email", "Please enter a valid email address").isEmail(),
  check("password", "Password is required").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateRequestOnUserDatabaseRegister = [
  check("email", "Please enter a valid address email").isEmail(),
  check("givenName", "Please enter a given name").not().isEmpty(),
  check("familyName", "Please enter a family name").not().isEmpty(),
  ...validateStrongPassword,
];

const validateRequestOnUserGoogleLogin = [
  check("googleEmail", "Google email address should be provided").isEmail(),
  check("googleId", "googleId should be provided").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateRequestOnUserGoogleRegister = [
  check("googleEmail", "Google email address should be provided").isEmail(),
  check("googleId", "googleId should be provided").not().isEmpty(),
  check("givenName", "Given name should be provided").not().isEmpty(),
  check("familyName", "Family name should be provided").not().isEmpty(),
  check("googleEmail", "Email in use").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject(`Sorry, ${user.email} is already in use. If ${user.email} is yours, try to sign in with it`);
      }
    })
  }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateRequestOnLinkGoogle = [
  check("googleEmail", "Google email address should be provided").isEmail(),
  check("googleId", "googleId should be provided").not().isEmpty(),
  check("googleEmail", "Email in use").custom((value) => {
    return User.findOne({ googleEmail: value }).then((user) => {
      if (user) {
        return Promise.reject(`Sorry, ${user.email} is already in use. If ${user.email} is yours, try to sign in with it`);
      }
    })
  }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = {
  validateRequestOnUserCreate,
  validateStrongPassword,
  validateUserUniqueEmail,
  validateUserUniqueEmailOnUpdate,
  validateRequestOnUserRoleCreate,
  validateRequestOnUserRoleUpdate,
  validateRequestOnModuleCreate,
  validateRequestOnModuleUpdate,
  validateRequestOnPermissionGrant,
  validateRequestOnPermissionRevoke,
  validateRequestOnUserUpdate,
  validateRequestOnUserChangeRole,
  validateRequestOnUserChangePassword,
  validateRequestOnUserDatabaseLogin,
  validateRequestOnUserDatabaseRegister,
  validateRequestOnUserGoogleLogin,
  validateRequestOnUserGoogleRegister,
  validateRequestOnLinkGoogle,
};
