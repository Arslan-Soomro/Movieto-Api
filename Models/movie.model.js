const Sequelize = require('sequelize');
const db = require('../Utils/database');

const Movie = db.define("movie", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    img_url: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    url: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    launch_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },

    rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }

});

module.exports = Movie;