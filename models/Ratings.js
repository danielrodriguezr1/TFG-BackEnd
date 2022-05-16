const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ratingSchema = new Schema ({
    rating: {
        type: Number,
        required: true
    },

    user : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },

    filmOrShow : {
        type: Number,
        required: true
    },

    type : {
        type: Number, //0 --> PELICULA     1 --> SERIE
        required: true
    }
})

module.exports = mongoose.model('Ratings', ratingSchema);