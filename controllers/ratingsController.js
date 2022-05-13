const Rating = require('../models/Ratings');
const async = require('async');
const { findOneAndUpdate } = require('../models/Ratings');
;

exports.addRating =  async (req, res, next) => {
    try {
        const idUser = req.params.id;
        let data = {
            rating : req.body.rating,
            user : idUser,
            filmOrShow : req.body.idFilmOrShow,
        }

        const query = { filmOrShow: req.body.idFilmOrShow, user: req.params.id};
        const update = { $set: { rating: req.body.rating}};
        const options = { upsert: true };

        const ratings = await Rating.updateOne(query, update, options);
        res.status(200).send(ratings);

    } catch (error) {
        console.log(error)
    }
};

exports.getRatings = async  (req, res, next) => {
    const ratings = await Rating.find({})
    res.status(200).send(ratings);
};

exports.getRatingsByUser = async (req, res, next) => {
    try {
        const ratings = await Rating.find({user: req.params.id});
        res.status(200).send(ratings);
        
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }
};

exports.getRatingByUser = async (req, res, next) => {
    try {
        const ratings = await Rating.find({user: req.params.id, filmOrShow:req.params.idFilmOrShow});
        res.status(200).send(ratings);
        
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }
};