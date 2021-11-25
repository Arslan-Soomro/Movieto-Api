const Sequelize = require('sequelize');
const db = require('../Utils/database');

const User = db.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },

    full_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    user_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = User;