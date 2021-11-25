const db = require('./database');

const User = require('../Models/user');
const Movie = require('../Models/movie');
const WatchList = require('../Models/watchlist');

//Check If it Works

const initDB = () => {
    try{
        //Create a many to many relationship
        WatchList.belongsTo(User, { foreignKey: 'user_id'});
        WatchList.belongsTo(Movie, { foreignKey: 'movie_id'});

        User.hasMany(WatchList, { foreignKey: 'user_id'});
        Movie.hasMany(WatchList, { foreignKey: 'movie_id'});

        db.sync().then(() => console.log("Succesfully Initiated"));
    }catch(err){
        console.log("Error While Initiating, ", err.message);
    }
}

module.exports = initDB;