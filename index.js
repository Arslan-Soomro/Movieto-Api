const express = require('express');
var cors = require('cors')
const app = express();
const db = require('./Utils/database.js');

//Get Route Handlers
const usersRouter = require('./Routes/user.route');
const movieRouter = require('./Routes/movie.route');
const watchlistRouter = require('./Routes/watchlist.route');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Handle Routes
app.use('/user', usersRouter);
app.use('/movie', movieRouter);
app.use('/watchlist', watchlistRouter)

app.get('/', (req, res) => {
    console.log('Endpoint Hit');
    res.send("Welcome to Movieto Api");
})

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});