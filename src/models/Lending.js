const { DataTypes, Model } = require("sequelize");
const User = require("./User");
const sequelize = require("../../db")();

class Lending extends Model {}

Lending.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    typeOfProject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    durationOfLoan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountToLoan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rateOfLoan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "refused"),
      defaultValue: "pending",
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validationNote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Lending",
  }
);

Lending.belongsTo(User, {
  as: 'backer',
  foreignKey: {
    allowNull: false,
    name: 'userId',
  }
});

Lending.belongsTo(User, {
  as: 'validator',
  foreignKey: {
    allowNull: true,
    name: "validatedBy",
  },
});

User.hasMany(Lending, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: {
    name: 'validatedBy',
  }
})

User.hasMany(Lending, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT',
  foreignKey: {
    name: 'userId',
  }
})


Lending.sync({ alter: true }).catch((error) => console.error(error));

module.exports = Lending;
