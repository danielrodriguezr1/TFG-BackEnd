const Users = require('../models/Users');
const usersData = require('../data/usersData');
const jwt = require("jsonwebtoken");
const async = require('async');

var nodemailer = require('nodemailer');

//agregar usuario
exports.add = async (req, res) => {
    const user = new Users(req.body);
    try {
        await usersData.save(user);
        //await user.save();
        res.json({message: 'Nuevo usuario agregado'});
    } catch (error) {
        res.json({message: 'Error al procesar la petición'});
        console.log(error);
        res.send(error);
        next();
    }
};

//primera accion: list
exports.list = async (req,res) => {
    try {
        const user = await Users.find({});
        res.json(user);
    } catch (error) {
        console.log(error);
        res.send(error);
        next();
    }
};


//leer usuario por nickname
exports.getUserByNickname = async (req, res, next) => {
    let loadedUser;
    usersData.findOne({nickname:req.params.nickname}) 
        .then(user => {
            if(!user){
                res.status(404).json({message: "No existe el usuario con ese nickname"});
                const error = new Error("No existe el usuario con ese nickname");
                error.statusCode = 404;
                throw error;
            }
            else{
                loadedUser = user;
                console.log(loadedUser);
                res.status(200).json({user:loadedUser});
            }
        })
        .catch(err => {
            if(!err.statusCode)err.statusCode=500;
            next(err);
        });    
}

//leer usuario por id
exports.show = async (req, res, next) => {

    let loadedUser;

    usersData.findById(req.params.id) 
        .then(user => {
            if(!user){
                res.status(404).json({message: "No existe el usuario con esa id"});
                const error = new Error("No existe el usuario con esa id");
                error.statusCode = 404;
                throw error;
            }
            else{
                loadedUser = user;
                console.log(loadedUser);
                res.status(200).json({user:loadedUser});
            }
        })
        .catch(err => {
            if(!err.statusCode)err.statusCode=500;
            next(err);
        });    
}

//actualizar usuario
exports.patch = async (req, res, next) => {
    let user_id = req.params.id;
    console.log(req.file);
    Users.findById(user_id)
    .then(user => {
        let update;

        if(typeof req.file !== 'undefined'){
                update = { 
                    "name": req.body.new_name,
                    "lastname": req.body.new_lastname,
                    "nickname": req.body.new_nickname,
                    "email": req.body.new_email,
                    "about": req.body.new_about,
                    "profileImage": req.file.location,
                    
                }
            
        }
        else{
            update = { 
                "name": req.body.new_name,
                "lastname": req.body.new_lastname,
                "nickname": req.body.new_nickname,
                "email": req.body.new_email,
                "about": req.body.new_about,
            }
        }

        Users.findByIdAndUpdate(user_id,update)
        .then(user => {
            if(!user) {
                res.status(404).json({message: 'Este usuario no existe'});
            }
            else {
                res.status(201).json({message: 'Informacion modificada!'});
            }
        })
        .catch(err => {
            if(!err.statusCode){
                    err.statusCode = 500;
            }
            next(err);
        });
    })
}

//eliminar usuario
exports.delete = async (req, res, next) => {
    try {
        const user = await Users.findOneAndDelete({_id: req.params.id});
        if (!user) {
            res.status(404).json({
                messaje: 'El usuario no existe'
            })
        }
        res.status(200).json({message: 'El usuario ha sido eliminado'});
    } catch (error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }
}



//login
exports.logIn = (req, res, next) => {

    let loadedUser;

    usersData.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                res.status(404).json({message: "El usuario con este correo no se ha encontrado"});
                const error = new Error("El usuario con este correo no se ha encontrado");
                error.statusCode = 404;
                throw error;
            }
            else{
                loadedUser = user;
                return loadedUser.validPassword(req.body.password);
            }
        })
        .then(isEqual => {
            if(!isEqual){
                res.status(401).json({message: "La contrasena no es correcta!"});
                const error = new Error("Contrasena incorrecta");
                error.statusCode = 401;
                throw error;
            }
            else{
                const token = jwt.sign({email: loadedUser.email, userId: loadedUser._id.toString()}, process.env.JWT_KEY);
                res.status(200).json({token: token, message: "Logeado correctamente!", userId: loadedUser._id.toString()});
            }
        })
        .catch(err => {
            if(!err.statusCode)err.statusCode=500;
            next(err);
        });
}


//check email
exports.checkEmail = (req,res,next) => {

    Users.findOne({email: req.params.email})
    .then(user => {
            if(user){

                res.status(409).json({message:'El correo ya está en uso'});

                const error = new Error("El correo ya está en uso");
                error.statusCode = 409;
                throw error;
            }
            else{
                res.status(200).json({message: 'El correo aún no está en uso'});
            }
        }
    )
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }); 
}


//checkUser
exports.checkNickname = (req,res,next) => {

    Users.findOne({nickname: req.params.nickname})
    .then(user => {
            if(user){

                res.status(409).json({message:'El nombre de usuario ya está en uso'});

                const error = new Error("El nombre de usuario ya está en uso");
                error.statusCode = 409;
                throw error;
            }
            else{
                res.status(200).json({message: 'El nombre de usuario aún no está en uso'});
            }
        }
    )
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }); 
}


//sign up
exports.signUp = (req, res, next) => {

   usersData.findOne({email: req.body.email})
        .then(user => {
            if(user){

                res.status(409).json({message:'El correo ya esta en uso'});

                const error = new Error("El correo ya esta en uso");
                error.statusCode = 409;
                throw error;
            }
            else{
                usersData.findOne({nickname: req.body.nickname})
                .then(user => {
                    if(user){
        
                        res.status(404).json({message:'El nombre de usuario ya esta en uso'});
        
                        const error = new Error("El nombre de usuario ya esta en uso");
                        error.statusCode = 404;
                        throw error;
                    }
                    else{
                        const user = new Users({
                            name: req.body.name,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            nickname: req.body.nickname,
                            password: req.body.password
                        });
        
                        usersData.save(user)
                            .then(result =>{
                                const token = jwt.sign({email: result.email, userId: result._id.toString()}, process.env.JWT_KEY);
                                res.status(201).json({token: token, message: 'Usuario creado!', userId: result._id.toString()});
                            })
                        }
                    }).catch(err => {
                        if(!err.statusCode){
                            err.statusCode = 500;
                        }
                        next(err);
                    }); 
            }
        }).catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }); 
};

//enviar codigo contraseña
exports.forgotPassword = async (req, res, next) => {

    const message = 'Compruebe su correo para restablecer la contraseña.';
    let verificationLink;
    let emailStatus = 'OK';
    
          
         usersData.findOne({email: req.body.email}).then(user => {
            if (user) {
                const token = jwt.sign({email: user.email, userId: user._id.toString()},process.env.jwtSecretReset, {expiresIn:'10m'});
                verificationLink = `http://localhost:5000/new-password/${token}`;
                user.resetToken = token;

                var tokenReset = token;
                var stringCodi = token.toString().replace(/\W_/g, '').slice(-6);

                console.log(stringCodi);
                //ENVIAR CORREO

                var transporter = nodemailer.createTransport({
                    pool: true,
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true, // use TLS
                    auth: {
                    user: "danielroru19@gmail.com",
                    pass: "passworddrr",
                    },
                });
                
                var mailOptions = {
                    from: '"@noreply" <danielroru19@gmail.com>', // sender address
                    to: user.email, // list of receivers
                    subject: 'Restablecer contraseña.', // Subject line
                    html: `Por favor, copie el siguiente código en la aplicación para finalizar su restablecimiento de contraseña:<br><br><b>${stringCodi}</b>`,
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });

                usersData.save(user);
                res.json({token: tokenReset, codi: stringCodi});
            }
            else {
                res.status(404).json({message:'El correo no existe'});

                const error = new Error("El correo no existe");
                error.statusCode = 404;
                throw error;            
            }

    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }); 

};

//restablecer contraseña
exports.createNewPassword = async (req, res, next) => {
    const {newPassword} = req.body;
    const resetToken = req.headers.reset;

    let jwtPayload;
    
    try {
        jwtPayload = jwt.verify(resetToken, process.env.jwtSecretReset);
        const user = await usersData.findOne({resetToken: resetToken});

        user.password = newPassword;
        await usersData.save(user);
    
    } catch (error) {
        return res.status(401).json({message: 'Algo fue mal'});
    }

    res.json({message: 'Contraseña cambiada'}) 

},

//devolver watchlist de un usuario
exports.getWatchlistFilmByUser = async (req, res, next) => {
    try {
        Users.findById(req.params.id).then(user => {
            res.status(200).json({watchListFilm: user.watchListFilm});
        })
        
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }
},

//añadir pelicula a la watchlist de un usuario
exports.addFilmToWatchlist = async (req, res, next) => {
    try {
        var obj = { idFilm: req.body.idFilm };
        Users.findOneAndUpdate(
            {_id:req.params.id},
            {$push: { watchListFilm: obj} },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
            res.status(200).json({
                message: 'OK'
            })
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }   
},

//borrar pelicula de la watchlist de un usuario
exports.deleteFilmWatchlist = async (req, res, next) => {
    try {
        var obj = { idFilm: req.params.idFilm };
        Users.findOneAndUpdate(
            {_id:req.params.id},
            {$pull: { watchListFilm: obj} },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
            res.status(200).json({
                message: 'OK'
            })
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    } 
},

//devolver watchlist de series de un usuario
exports.getWatchlistShowByUser = async (req, res, next) => {
    try {
        Users.findById(req.params.id).then(user => {
            res.status(200).json({watchListShow: user.watchListShow});
        })
        
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }
},

//añadir serie a la watchlist de un usuario
exports.addShowToWatchlist = async (req, res, next) => {
    try {
        var obj = { idShow: req.body.idShow };
        Users.findOneAndUpdate(
            {_id:req.params.id},
            {$push: { watchListShow: obj} },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log(success);
                }
            });
            res.status(200).json({
                message: 'OK'
            })
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    }   
},

//eliminar serie de la watchlist de un usuario
exports.deleteShowWatchlist = async (req, res, next) => {
    try {
        var obj = { idShow: req.params.idShow };
        Users.findOneAndUpdate(
            {_id:req.params.id},
            {$pull: { watchListShow: obj} },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
            res.status(200).json({
                message: 'OK'
            })
    }catch(error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        });
    } 
},

//comprobar si una pelicula o serie existe en la watchlist de un usuario
exports.existsInWatchlist = async (req, res, next) => {

    try {
        await Users.findById(req.params.id).then(user => {
            user.watchListFilm.map(function(item) {
                if (item.idFilm == req.params.idFilmOrShow) {
                    return res.status(200).json({message: "Esta película o serie se encuentra en la watchlist del usuario"})
                }
            }),
            user.watchListShow.map(function(item) {
                if (item.idShow == req.params.idFilmOrShow) {
                    return res.status(200).json({message: "Esta película o serie se encuentra en la watchlist del usuario"})
                }
            })
            return res.status(404).json({message: "Esta película o serie NO se encuentra en la watchlist del usuario"})
            
        })
    } catch (error) {
        
    }
},

//seguir a un usuario
exports.followUser = async (req, res, next) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await Users.findById(req.params.id);
            const currentUser = await Users.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push:{followers:req.body.userId}});
                await currentUser.updateOne({$push:{followings:req.body.userId}});
                res.status(200).json({message: "Se ha seguido al usuario"});
            } else {
                res.status(403).json({message: "Ya sigues a este usuario"});
            }
        } catch (error) {
            res.status(400).json({
                message: 'Error al procesar la peticion'
            });
        }
    }
    else {
        res.status(403).json({message: "No puedes seguirte a ti mismo"})
    }
}

//dejar de seguir a un usuario
exports.unfollowUser = async (req, res, next) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await Users.findById(req.params.id);
            const currentUser = await Users.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull:{followers:req.body.userId}});
                await currentUser.updateOne({$pull:{followings:req.body.userId}});
                res.status(200).json({message: "Se ha dejado de seguir al usuario"});
            } else {
                res.status(403).json({message: "Tu no sigues a este usuario"});
            }
        } catch (error) {
            res.status(400).json({
                message: 'Error al procesar la peticion'
            });
        }
    }
    else {
        res.status(403).json({message: "No puedes dejar de seguirte a ti mismo"})
    }
}