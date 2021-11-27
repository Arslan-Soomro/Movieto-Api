//Define routes to create, get, update and delete a user.
//Validate and authenticate users
//Encrypt and then store passwords
//Compare Passwords
//Generate JWT Tokens

const express = require('express');
var cors = require('cors')
const app = express();
const db = require('./Utils/database.js');

//Get Route Handlers
const usersRouter = require('./Routes/user.route');
const tmdbRouter = require('./Routes/tmdb.route');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Handle Routes
app.use('/user', usersRouter);
app.use('/movie', tmdbRouter);

app.get('/', (req, res) => {
    console.log('Endpoint Hit');
    res.send("Welcome to Movieto Api");
})

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});