const Sequelize = require("sequelize");

const connection = new Sequelize('blogpress', 'root', 'Rpr_96340213', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;