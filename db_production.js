const { Sequelize } = require("sequelize");

const db = () => {
  const sequelize = new Sequelize({
    dialect: "mariadb",
    username: "m8_u_87993",
    password: "m8_u_87993",
    database: "m8_u_87993",
    port: 3307,
    logging: false,
  });
  return sequelize;
};

module.exports = db;
