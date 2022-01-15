const { DataTypes, Model } = require("sequelize");
const sequelize = require('../../db')();
const bcrypt = require('bcryptjs');

class User extends Model { }

User.init({
  id: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  givenName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  familyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  newbies: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'MEMBER', 'CLIENT', 'INVERSTOR'),
    defaultValue: 'MEMBER',
  },
  updatedAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  createdAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'User',
});

User.afterSync((option) => {
  User.findOrCreate({
    where: {email: "admin@email.com"},
    defaults: {
      "email": "admin@email.com",
      "givenName": "System",
      "familyName": "Administrator",
      "password": bcrypt.hashSync("adminPassword", bcrypt.genSaltSync(10)),
      "role": "ADMIN"
    }
  }).catch(error => console.error(error));
})

User.sync({ alter: false }).catch(error => console.error(error));

module.exports = User;
