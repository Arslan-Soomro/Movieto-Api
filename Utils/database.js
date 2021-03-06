//the path in dotenv config can create problems
require('dotenv').config();
const Sequelize = require('sequelize');

let sequelize;

try {

    sequelize = new Sequelize(process.env.DB_URI, { dialect: 'mysql', dialectModule: require('mysql2') });
    sequelize.authenticate().then(() => console.log('Connection has been established successfully.'));

} catch (error) {
    console.error('Unable to connect to the database:', error.message);
}


module.exports = sequelize;