const express = require('express');
const router = express.Router();

const watchlistModel = require('../Models/watchlist.model');
const movieModel = require('../Models/movie.model');
const db = require('../Utils/database');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('../Utils/utils');

router.post('/add', async (req, res) => {

    if(req.body.token && req.body.movie_id){

        let tokenData = verifyToken(req.body.token);

        if(!tokenData){
            res.status(401).json({message: "Invalid Token"});
            return ;
        }

        await watchlistModel.create({user_id: tokenData.id, movie_id: req.body.movie_id});
        res.status(201).json({message: "Movie Succesfully Added To WatchList"});

    }else{
        res.status(400).json({message: "Invalid Request"});
    }

});

router.post('/remove', async (req, res) => {
    if(req.body.token && req.body.movie_id){
        let tokenData = verifyToken(req.body.token);

        if(!tokenData){
            res.status(401).json({message:"Invalid Token"});
            return ;
        }

        //It doesn't matter if any records with given criteria is not found
        await watchlistModel.destroy({where: {user_id: tokenData.id, movie_id: req.body.movie_id}});
        res.status(201).json({message: "Movie Succesfully Removed From WatchList"});
    }else{
        res.status(400).json({message: "Invalid Request"});
    }
});

router.post( '/' , async (req, res) =>{
    try{

        let tokenData = verifyToken(req.body.token);

        if(!tokenData){
            res.status(401).json({message:"Invalid Token"});
            return ;
        }

        console.log(tokenData);

        //RETURNS Objects that contain movie_ids that belong to a certain user
        const mObjIds = await watchlistModel.findAll({where: {user_id: tokenData.id}, attributes: ["movie_id"]});
        //CONVERTS the array of objects into array of integers which contains movie_ids
        const mIds = mObjIds.map((item) => item.movie_id);
        //RETURNS movie data according to the data provided
        const mData = await movieModel.findAll({where: { id: mIds }});
        res.status(200).json(mData);

        /*
        This query does what above statements do, but is not deprecated and hence is here for reference;
        const data = await db.query(`SELECT m.id, m.name, m.img_url, m.url, m.launch_date, m.rating FROM watchlists w JOIN movies m ON w.movie_id = m.id WHERE user_id = ${user_id};`);
        */

    }catch(err){
        res.status(500).json({message: "Unable to process the request"});
        console.log("Error@ShowingWatchList: " + err.message);
    }
});

module.exports = router;