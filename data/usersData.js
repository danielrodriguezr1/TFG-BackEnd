const Users = require('../models/Users');
const usersData = require('../data/usersData');
const jwt = require("jsonwebtoken");
const async = require('async');

var nodemailer = require('nodemailer');
const res = require('express/lib/response');
const { findById, findOne } = require('../models/Users');

module.exports = {
    async save(user) {
        try {
            return await user.save();
        } catch (error) {
            next();
        }
    },

    async findOne(field) {
        const user = Users.findOne(field);
        return user;
    },

    async findById(id) {
        try {
            const user = Users.findById(id);
            return user;
        } catch (error) {
            next();
        }
    }

}