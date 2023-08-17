const {Sequelize} = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('users' , {
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password : {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//CREATE TABLE
//User.sync({force: true});

module.exports = User;