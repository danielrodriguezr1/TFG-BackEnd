const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name : {
        type: String,
        trim: true,
        required: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
    },
    nickname: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,    
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    followers: {
        type: Array,
        default: []
    },

    followings: {
        type: Array,
        default: []
    },

    about: {
        type: String,
        default : "iNuevo por aquí!",
        optional: true
    },

    profileImage: {
        type: String,
        optional: true,
        default: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
    },
    
    coverImage: {
        type: String,
        optional: true
    },

    resetToken: {
        type: String,
        optional: true,
    }
})

usersSchema.method('validPassword', async function(unhashed) {
    const user=this;
    return await bcrypt.compare(unhashed,user.password);
})

usersSchema.pre('save',async function(next) {
    const user=this; 
     const hash= await bcrypt.hash(user.password,10);
     user.password=hash;
})



module.exports = mongoose.model('Users', usersSchema);