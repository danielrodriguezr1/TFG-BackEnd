const express = require('express');

const router = express.Router();

const usersController = require('../controllers/usersController');
const aws = require("aws-sdk");


/*const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  })*/

module.exports = function() {

    //post: /users
    router.post('/users', usersController.add);
    //get: /users
    router.get('/users', usersController.list);
    //leer usuario
    //get: /users/:id
    router.get('/users/:id', usersController.show);
    //put: /users/:id
    router.put('/users/:id', usersController.update);
    //delete: /customers/:id
    router.delete('/users/:id', usersController.delete)

    //login y sign up
    //router.post('/signup', userController.signUp);
    router.post('/login', usersController.logIn);
    router.post('/signup', usersController.signUp);

    //Forgot Password
    router.put('/forgot-password',usersController.forgotPassword);
    //Create a new password
    router.put('/new-password',usersController.createNewPassword);


    return router;
};