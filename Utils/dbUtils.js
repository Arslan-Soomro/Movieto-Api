const db = require('./database');

const User = require('../Models/user.model');
const Movie = require('../Models/movie.model');
const WatchList = require('../Models/watchlist.model');

const MovieData = require('./MovieData.json');
const { formatMD } = require('./utils');

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

const seedMoviesDB = () => {
    try{
        formatMD(MovieData); // Give fields suitable names to suit the database design
        Movie.bulkCreate(MovieData); // Insert All Of The Data into DB
    }catch(err){
        console.log("Error@SeedMovies: " + err.message);
    }
};


exports.initTables = initTables;
exports.resetUsersTable = resetUsersTable;