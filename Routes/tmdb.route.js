const express = require('express');

//For Scraping Data
const got = require("got");
const cheerio = require("cheerio");

//For Accessing Database
const db = require('../Utils/database');
const movieModel = require('../Models/movie.model');

const router = express.Router();

router.get('/', async (req, res) => {
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
                imgsrc : imgSrc,
                genre : genres,
                title : title.text(),
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

        let pageNo = 0;

        if(!req.query.page && !(req.query.page < 0)){
            pageNo = req.query.page;
        }

        res.status(200).json(await movieModel.findAll({offset : pageNo, limit: 10 * (pageNo || 1)}));
    
    }catch(err){
        console.log("Error@getAll@tmdb : " + err.message);
        res.status(500).json({ message: "Unable to process the request"});
    }
});


module.exports = router;