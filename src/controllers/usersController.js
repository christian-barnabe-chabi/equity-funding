const User = require("../models/User");

const getUsers = async (req, res, next) => {
  const users = await User.find()
    .populate("role")
    .populate({
      path: "permissions",
      model: "UserPermissions",
      populate: { path: "module" },
    })
    .catch((error) => {
      res.status(500).json({ error: error });
      throw new Error(error);
    });

  res.json(users);
};

const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate("role")
    .populate({
      path: "permissions",
      model: "UserPermissions",
      populate: { path: "module" },
    })
    .catch((error) => {
      res.status(500).json({ error: error });
      return;
    });

  if (!user) {
    res.status(404).json({ error: "User not found" });
  } else {
    res.json(user);
  }
};

const createUser = async (req, res, next) => {
  const requestData = req.body;

  getPermissionsFromRole(res, requestData.role)
    .then(async (permissions) => {
      requestData.permissions = permissions;

      const _id = (
        await User.create(requestData).catch((error) => {
          res.status(500).json({ error: error });
          throw new Error(error);
        })
      )._id;

      const user = await User.findById(_id)
        .populate("role")
        .populate({
          path: "permissions",
          model: "UserPermissions",
          populate: { path: "module" },
        })
        .catch((error) => {
          res.status(500).json({ error: error });
          throw new Error(error);
        });
      res.json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

const updateUser = async (req, res, next) => {
  const requestData = req.body;

  const reply = await User.updateOne({ _id: req.params.id }, requestData).catch(
    (error) => {
      res.status(500).json({ error: error });
      throw new Error(error);
    }
  );

  if (!reply.n) {
    return res.status(404).json({ error: "User not found" });
  }

  let user = await User.findById(req.params.id)
    .populate("role")
    .populate({
      path: "permissions",
      populate: { path: "module" },
    })
    .catch((error) => {
      res.status(500).json({ error: error });
      throw new Error(error);
    });

  res.json(user);
};

const revokeUserPermission = async (req, res, next) => {
  const requestData = req.body;
  const newPermissions = [];
  const user = await User.findById(requestData.user)
    .populate({
      path: "permissions",
      model: "UserPermissions",
      populate: { path: "module" },
    })
    .catch((error) => {
      res.status(500).json({ error: error });
      throw new Error();
    });

  const module = await Module.findById(requestData.module).catch((error) => {
    res.status(500).json({ error: error });
    throw new Error(error);
  });

  if (!module) {
    return res.status(404).json({ error: "Module not found" });
  }

  if (user) {
    user.permissions.forEach((permission) => {
      if (permission.module._id != requestData.module) {
        newPermissions.push(permission._id);
      }
    });

    user.permissions = newPermissions;
    await user.save().catch((error) => {
      res.status(500).json({ error: error });
      throw new Error(error);
    });

    res.json({ message: "Authorization revoked" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

const setUserPermission = async (req, res, next) => {
  const requestData = req.body;
  const newPermissions = [];

  const user = await User.findById(requestData.user)
    .populate({
      path: "permissions",
      model: "UserPermissions",
      populate: { path: "module" },
    })
    .catch((error) => {
      res.status(500).json({ error: error });
      throw new Error();
    });

  if (user) {
    // revoke permission for the module first
    user.permissions.forEach((permission) => {
      if (permission.module._id != requestData.module) {
        newPermissions.push(permission._id);
      }
    });

    // add new permission for the same module but different accessCode
    UserPermission.findOne({
      module: requestData.module,
      accessCode: requestData.accessCode,
    })
      .then((newAddPermission) => {
        if (!newAddPermission) {
          throw new Error(
            "Permission not found. Make sure the module is correct as well the access code"
          );
        }
        newPermissions.push(newAddPermission._id);
      })
      .then(async () => {
        user.permissions = Array.from(new Set(newPermissions));
        console.log(newPermissions);

        await user.save().catch((error) => {
          res.status(500).json({ error: error });
          throw new Error(error);
        });

        res.json({ message: "Authorization granted" });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
        throw new Error(error);
      });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

const deleteUser = async (req, res, next) => {
  const requestData = req.body;

  if (req.user.role != "SYSTEM_ADMIN" || req.user._id == req.params.id) {
    return res.status(403).json("Unauthorized");
  }

  // revoke login module permission
  const loginModule = await Module.findOne({
    moduleName: "LOGIN_MODULE",
  })
    .select("_id")
    .catch((error) => {
      res.status(500).json({ error: error });
      throw new Error(error);
    });

  if (!loginModule) {
    return res.status(500).json({ error: "LOGIN_MODULE not found" });
  }

  const loginModuleId = loginModule._id;

  const user = await User.findById(requestData.user)
    .populate({
      path: "permissions",
      model: "UserPermissions",
      populate: { path: "module" },
    })
    .catch((error) => {
      res.status(500).json({ error: error });
      throw new Error();
    });

  if (user) {
    user.permissions.forEach((permission) => {
      if (permission.module._id != loginModuleId) {
        newPermissions.push(permission._id);
      }
    });

    user.permissions = newPermissions;
    await user.save().catch((error) => {
      res.status(500).json({ error: error });
      throw new Error();
    });

    return res.status(200).json({
      message: `Login permission revoked for user #${req.params.id}`,
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

const changeUserPassword = async (req, res, next) => {
  const requestData = req.body;
  const user = await User.findById(req.authId);

  if (user) {
    const isGoogleOnly = !user.password && user.googleEmail && user.googleId;
    let isOldPasswordCorrect = false;

    if (isGoogleOnly) {
      isOldPasswordCorrect = true;
    } else {
      isOldPasswordCorrect = await user.matchPassword(requestData.oldPassword);
    }

    if (isOldPasswordCorrect) {
      user.password = requestData.password;
      user.usesPassword = true;
      await user.save().catch((error) => {
        res.status(500).json({ error: error });
      });

      res.json({ message: "Password changed" });
    } else {
      res.status(401).json({ error: "Incorect old password" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

const changeUserRole = (req, res, next) => {
  const requestData = req.body;

  getPermissionsFromRole(res, requestData.role)
    .then(async (permissions) => {
      requestData.permissions = permissions;

      const reply = await User.updateOne(
        { _id: requestData.user },
        requestData
      ).catch((error) => {
        res.status(500).json({ error: error });
        throw new Error(error);
      });

      if (!reply.n) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json({ message: "User role changed" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

const linkGoogle = async (req, res, next) => {
  const requestData = req.body;

  const user = await User.findById(req.authId);

  if (user) {
    user.googleEmail = requestData.googleEmail;
    user.googleId = requestData.googleId;
    user.usesGoogle = true;
    await user.save().catch((error) => {
      res.status(500).json({ error: error });
    });

    res.json({ message: "Google account linked" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

const unlinkGoogle = async (req, res, next) => {
  const user = await User.findById(req.authId);

  if (user) {
    const usesPassword = user.password;

    if (usesPassword) {
      user.googleEmail = null;
      user.googleId = null;
      user.usesGoogle = false;
      await user.save().catch((error) => {
        res.status(500).json({ error: error });
      });

      res.json({ message: "Google account unlinked" });
    } else {
      res.status(400).json({ error: "You must first define a password" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

module.exports = {
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
};
