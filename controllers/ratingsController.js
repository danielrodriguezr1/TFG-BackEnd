const Rating = require('../models/Ratings');
const async = require('async');
const { findOneAndUpdate } = require('../models/Ratings');
const { forEach } = require('async');
const fetch = require('node-fetch');


exports.addRating =  async (req, res, next) => {
    try {
        const idUser = req.params.id;
        let data = {
            rating : req.body.rating,
            user : idUser,
            filmOrShow : req.body.idFilmOrShow,
            type: req.body.type
        }

        const query = { filmOrShow: req.body.idFilmOrShow, user: req.params.id, type: req.body.type};
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


exports.getRecommendations =  async (req, res, next) => {
    try{
        //SELECCIONAR EL ID DE TODAS LAS VALORACIONES EN ORDEN DE NOTA
        var mySort = {rating : -1};
        const ratings = await Rating.find({user:req.params.id, type:req.params.type}).sort(mySort).select("filmOrShow");
        console.log(ratings.length)

        //GUARDAR EN UN ARRAY TOPRATINGS LAS 15 MEJORES VALORADAS
        var topRatings = ratings
        topRatings.splice(15)
        console.log(topRatings.length)
        //POR CADA PELICULA/SERIE ENTRE LAS 15 MEJOR VALORADAS, SELECCIONAR  7/3 PELICULAS/SERIES RECOMENDADAS
        var recommendationList = [];
    
        for (let item of topRatings) {

            var idFilmOrShow = item["filmOrShow"];
            var recommendationListAux = [];

            if (req.params.type == 0) {
                await fetch(`https://api.themoviedb.org/3/movie/${idFilmOrShow}/recommendations?api_key=4da6190ae8146416740424c70e3a2b85&language=es-ES&page=1`)
                .then(res => res.json())
                .then((json) => {
                    var ids = json.results.map(async function(x) {
                        recommendationListAux.push(x.id);
                    });
                    
                });  
                recommendationListAux.splice(7);
                
            }
            else {
                await fetch(`https://api.themoviedb.org/3/tv/${idFilmOrShow}/recommendations?api_key=4da6190ae8146416740424c70e3a2b85&language=es-ES&page=1`)
                .then(res => res.json())
                .then((json) => {
                    var ids = json.results.map(function(x) {
                        recommendationListAux.push(x.id);
                    });
                });    
                recommendationListAux.splice(3);            
            }
            recommendationList = recommendationList.concat(recommendationListAux);
        }
     
        //ELIMINAR PELICULAS VISTAS POR EL USUARIO
        var recommendationListFinal = [];
        for (var i = 0; i < recommendationList.length; i++) {
            var igual=false;
             for (var j = 0; j < ratings.length & !igual; j++) {
                 if(recommendationList[i] == ratings[j]['filmOrShow'] && 
                 recommendationList[i] == ratings[j]['filmOrShow']) 
                         igual=true;
             }
            if(!igual)recommendationListFinal.push(recommendationList[i]);
        }

        //ELIMINAR LAS RECOMENDACIONES REPETIDAS
        recommendationListFinalNoDuplicate = recommendationListFinal.filter(function(elem, pos) {
            return recommendationListFinal.indexOf(elem) == pos;
        })
       
        res.status(200).send(recommendationListFinalNoDuplicate)

    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }
};