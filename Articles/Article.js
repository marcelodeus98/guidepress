const {Sequelize} = require('sequelize');
const sequelize = require('../database/db');
const Category = require('../Categories/Category');

const Article = sequelize.define('article', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// CREATION OF RELATIONSHIP BETWEEN TABLES
Category.hasMany(Article); // A category has many articles
Article.belongsTo(Category); // A article has belongs to a category

// CREATE TABLE
//Article.sync({force: true});

module.exports = Article;