const express = require('express');
const got = require("got");
var cors = require('cors')
const app = express();
const { openConnection } = require('./Utils/database.js');

//Get Route Handlers
const usersRouter = require('./Routes/users');
const tmdbRouter = require('./Routes/tmdb');

const PORT = process.env.PORT || 5000;

app.use(cors());

//Handle Routes
app.use('/users', usersRouter);
app.use('/tmdb', tmdbRouter);

app.get('/', (req, res) => {
    console.log('Endpoint Hit');
    res.send("Welcome to Movieto Api");
})

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});