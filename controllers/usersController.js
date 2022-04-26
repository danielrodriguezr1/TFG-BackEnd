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


//leer cliente por id
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
    /*try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            res.status(404).json({
                message: 'El usuario no existe'
            });
        }

        res.json(user);

    } catch (error) {
        res.status(400).json({
            message: 'Error al procesar la peticion'
        })
    }*/
}

//actualizar usuario
exports.update = async (req, res, next) => {
    try {
        
        const user = await Users.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new: true }
        );
        res.json({
            message: 'Cliente actualizado correctamente'
        })
    } catch (error) {
        res.status(400).json({
            message:'Error al procesar la peticion'
        });
    }
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
        res.json({message: 'El usuario ha sido eliminado'});
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
                            .catch(err => {
                                if(!err.statusCode){
                                    err.statusCode = 500;
                                }
                                next(err);
                            }); 
                        }
                    })
            }
        })

};


exports.forgotPassword = async (req, res, next) => {

    const message = 'Compruebe su correo para restablecer la contraseña.';
    let verificationLink;
    let emailStatus = 'OK';
    
    try {        
        const user = await usersData.findOne({email: req.body.email});
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

            await usersData.save(user);
        }
        else {
            res.status(404).json({message:'El correo no existe'});

            const error = new Error("El correo no existe");
            error.statusCode = 404;
            throw error;            
        }

    } catch (error) {
        return res.json('Error al procesar la petición');
    }
    res.json({token: tokenReset, codi: stringCodi});
};

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

}