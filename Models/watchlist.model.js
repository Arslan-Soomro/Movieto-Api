const Sequelize = require('sequelize');
const db = require('../Utils/database');

const WatchList = db.define("watchlist", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = WatchList;