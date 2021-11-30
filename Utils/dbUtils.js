const db = require('./database');

const User = require('../Models/user.model');
const Movie = require('../Models/movie.model');
const WatchList = require('../Models/watchlist.model');

//Creates Tables and Their Associations
const initTables = () => {
    try{
        //Create a many to many relationship
        WatchList.belongsTo(User, { foreignKey: 'user_id'});
        WatchList.belongsTo(Movie, { foreignKey: 'movie_id'});

        User.hasMany(WatchList, { foreignKey: 'user_id'});
        Movie.hasMany(WatchList, { foreignKey: 'movie_id'});

        db.sync({force: true}).then(() => console.log("Succesfully Initiated"));
    }catch(err){
        console.log("Error While Initiating, ", err.message);
    }
}

const resetUsersTable = async () => {
    //Delete All Users
    await User.destroy({ truncate: { cascade: true, restartIdentity: true }}); 
    //Set PK to 0
    await db.query("ALTER TABLE users AUTO_INCREMENT = 0");
}

initTables();

exports.initTables = initTables;
exports.resetUsersTable = resetUsersTable;