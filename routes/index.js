const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const tmdbController = require('../controllers/tmdbController');
const imdbController = require('../controllers/imdbController');
const aws = require("aws-sdk");

const shortid = require("shortid");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region : process.env.AWS_BUCKET_REGION
  })

  const uploadS3 = multer({
    storage: multerS3({
      s3: s3,
      bucket: "profile-picture-danielrodriguezr1",
      //acl: "public-read",
      metadata: function(req, file, cb){
        cb(null, {fieldName: 'profileImage'});
      },
      key: function (req, file, cb) {
        cb(null, shortid.generate() + "-" + shortid.generate() + '.png');
      },
    })
  }).single('profileImage');

module.exports = function() {

    //Añadir usuario
    router.post('/users', usersController.add);
    //Leer todos los usuarios
    router.get('/users', usersController.list);
    //Leer usuario por id
    router.get('/users/:id',usersController.show);
    //Eliminar usuario
    router.delete('/users/:id', usersController.delete);


    //checkEmail
    router.get('/checkEmail/:email',usersController.checkEmail);

    //checkUser
    router.get('/checkNickname/:nickname',usersController.checkNickname);

    //Login
    router.post('/login', usersController.logIn);
    //Signup
    router.post('/signup', usersController.signUp);

    //Forgot Password
    router.put('/forgot-password',usersController.forgotPassword);

    //Create a new password
    router.put('/new-password',usersController.createNewPassword);

    //Update user
    router.patch('/users/:id', uploadS3 ,usersController.patch);

    //TMDB
    router.get('/getNowPlayingMovies', tmdbController.getNowPlayingMovies);
    router.get('/getTopRatedMovie', tmdbController.getTopRatedMovie);
    router.get('/getPopularMovies', tmdbController.getPopularMovies);
    router.get('/getPopularTV', tmdbController.getPopularTV);
    router.get('/getMovie/:id', tmdbController.getMovie);
    router.get('/getTV/:id', tmdbController.getTV);
    router.get('/findByTitle/:title', tmdbController.findByTitle);
    router.get('/cast/:id', tmdbController.cast);
    router.get('/castTV/:id', tmdbController.castTV);
    router.get('/crew/:id', tmdbController.crew);
    router.get('/crewTV/:id', tmdbController.crewTV);
    router.get('/platformsTV/:id', tmdbController.platformsTV);
    router.get('/platformsMovie/:id', tmdbController.platformsMovie);
    router.get('/external_idsTV/:id', tmdbController.external_idsTV);

    router.get('/getMovies/:query/:page', tmdbController.getMovies);
    router.get('/getTVShows/:query/:page', tmdbController.getTVShows);
    router.get('/getPersons/:query/:page', tmdbController.getPersons);


    //IMDB
    router.get('/getRatings/:id/',imdbController.getRatings);

    return router;
};
