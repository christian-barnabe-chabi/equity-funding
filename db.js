const { Sequelize } = require("sequelize");

const db = () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database/db.sqlite",
    logging: console.log,
    logging: false,
  });
  return sequelize;
};

module.exports = db;
