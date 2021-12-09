const express = require('express');
const router = express.Router();

const watchlistModel = require('../Models/watchlist.model');
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



module.exports = router;