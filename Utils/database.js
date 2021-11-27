const Sequelize = require('sequelize');

let sequelize;
    
try {
    sequelize = new Sequelize('Movieto', 'root', 'root', {
        host: 'localhost',
        dialect: 'mysql'
    });
    
    sequelize.authenticate().then(() => console.log('Connection has been established successfully.'));

} catch (error) {
    console.error('Unable to connect to the database:', error.message);
}




module.exports = sequelize;