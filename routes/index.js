const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const tmdbController = require('../controllers/tmdbController');
const aws = require("aws-sdk");


/*const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  })*/

module.exports = function() {

    //Añadir usuario
    router.post('/users', usersController.add);
    //Leer todos los usuarios
    router.get('/users', usersController.list);
    //Leer usuario por id
    router.get('/users/:id', usersController.show);
    //Actualizar usuario
    router.put('/users/:id', usersController.update);
    //Eliminar usuario
    router.delete('/users/:id', usersController.delete)

    //Login
    router.post('/login', usersController.logIn);
    //Signup
    router.post('/signup', usersController.signUp);

    //Forgot Password
    router.put('/forgot-password',usersController.forgotPassword);

    //Create a new password
    router.put('/new-password',usersController.createNewPassword);
    


    router.get('/getNowPlayingMovies', tmdbController.getNowPlayingMovies);
    router.get('/getTopRatedMovie', tmdbController.getTopRatedMovie);
    router.get('/getPopularMovies', tmdbController.getPopularMovies);
    router.get('/getPopularTV', tmdbController.getPopularTV);





    return router;
};
