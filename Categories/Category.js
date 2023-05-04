const {Sequelize} = require('sequelize');
const sequelize = require('../database/db');

const Category = sequelize.define('category' , {
    title :{
        type: Sequelize.STRING,
        allowNull: false,
    },
    slug : {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//CREATE TABLE
//Category.sync({force: true});

module.exports = Category;