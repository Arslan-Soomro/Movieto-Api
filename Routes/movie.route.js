const express = require('express');

//For Scraping Data
const got = require("got");
const cheerio = require("cheerio");

//For Accessing Database
const db = require('../Utils/database');
const movieModel = require('../Models/movie.model');
const Sequelize = require('sequelize');

const router = express.Router();

const PAGE_LIMIT = 20;

//Get a Random Movie
router.get('/', async (req, res) => {
    try{
        const randomMovie = await movieModel.findOne({ order: [Sequelize.fn('RAND')]});
        res.status(200).json(randomMovie);
    }catch(err){
        console.log("Error@Random@Movies: " + err.message);
        res.status(500).json({message: 'Unable to process the request'});
    }
});


//Scraps a movie from tmdb, provided its tmdb link
router.get('/tmdb', async (req, res) => {

    //TODO when link is undefined as host/?link=   then a error is produced, fix it

    const link = req.query.link;
    console.log('Link Hit : ', link);
    console.log(link ? 'Yes' : 'No');

    if(link){
        try{
            const page = await got(link);
            const $ = cheerio.load(page.body);

            const src = $('#original_header > div.poster_wrapper.false > div > div.image_content.backdrop > img').attr('src');
            const imgSrc = 'https://themoviedb.org' + (src.replace('_filter(blur)', ''));
            const title = $('#original_header > div.header_poster_wrapper.false > section > div.title.ott_false > h2 > a');
            const tagline = $('#original_header > div.header_poster_wrapper.false > section > div.header_info > h3.tagline');
            const disc = $('#original_header > div.header_poster_wrapper.false > section > div.header_info > div > p');
            const genres = $('#original_header > div.header_poster_wrapper.false > section > div.title.ott_false > div > span.genres').text().trim();
            const rating = $('.user_score_chart').first().data('percent');//Get rating of a movie

            const data = {
                img_url : imgSrc,
                genre : genres,
                name : title.text(),
                disc : disc.text(),
                tagline : tagline.text(),
                rating : rating,
            }

            res.status(200).json(data);
        }catch(err){
            console.log(err.message);
            response.status(500).json({ msg : err.message });
        }
    }else{
        res.status(404).json({msg : 'Invalid Link'});
    }
});

router.get('/all', async (req, res) => {
    try{

        let pageNo = 1;

        if(req.query.page > 1){
            pageNo = req.query.page;
        }

        //if pageNo = 0, then offset is 0 hence returning from start and when pageNo = 1 then 1*PAGE_LIMIT = 20, so records after 20 are required
        res.status(200).json(await movieModel.findAll({offset : (pageNo-1) * PAGE_LIMIT, limit: PAGE_LIMIT}));
    
    }catch(err){
        console.log("Error@getAll@tmdb : " + err.message);
        res.status(500).json({ message: "Unable to process the request"});
    }
});

router.get('/count', async (req, res) => {
    try{
        const movieCount = await movieModel.count();
        //totalPages = movieCount / Limit
        res.status(200).json({data: {count: movieCount, totalPages: movieCount/PAGE_LIMIT}});

    }catch(err){
        console.log('Error@Count@Movies: ', err.message);
        res.status(500).json({message: 'Unable to process the request'});
    }
})


module.exports = router;