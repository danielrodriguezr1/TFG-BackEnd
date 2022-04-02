const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const routes = require('./routes');

//create server
const app = express();

//conne mongodb
mongoose.Promise = global.Promise;
mongoose.connect(
    //'mongodb://localhost/api-TFG',
    'mongodb+srv://dr1:passworddr1@cluster1.jhyyq.mongodb.net/api-TFG?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
    }
)
.then(db => console.log('Base de datos conectada'))
.catch(error => console.log(error));

//habilitar body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//habilitar cors
app.use(cors());

//app routes
app.use('/', routes());

/*app.get('/', function(req, res) {
    res.send('iHola mundo NodeJS! Prueba 1');
});*/

//server port
app.listen(process.env.PORT || 5000);
/*
app.listen(process.env.PORT || 5000, function () {
    console.log('iServidor web Express en ejecucion!');
});*/