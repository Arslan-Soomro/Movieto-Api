const Sequelize = require('sequelize');
const db = require('../Utils/database');

//This is a join table, that connects users with movies

const WatchList = db.define("watchlist", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    }
});

module.exports = WatchList;