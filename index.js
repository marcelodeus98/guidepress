const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

// FILE CONTROLLERS
const articlesController = require('./Articles/ArticlesController');
const categoriesController = require('./Categories/CategoriesController');
const usersController = require('./User/UsersController');

const app = express();

// Files Database
const Article = require('./Articles/Article');
const Category = require('./Categories/Category');

let PORT = 8080;

// Use engine
app.set('view engine', 'ejs');

// Sessions
app.use(session({
    secret: "qwe123",
    cookie: {
        maxAge: 3000
    }
}))

// Static
app.use(express.static('public'));

// Use body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// ROUTES
app.get('/', (req, res)=> {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 5
    }).then( articles => {
        Category.findAll().then( categories => {
            res.render('index', {articles : articles, categories:categories});
        });
    });
});

app.get('/:slug', (req, res) => {
     let slug = req.params.slug;

     Article.findOne({
        where: {
            slug: slug
        }
     }).then(article => {
        if(article != undefined){
            Category.findAll().then( categories => {
                res.render('articles', {article: article, categories: categories});
            });
        }
        else{
            res.redirect("/");
        }
     }).catch( err => {
        res.redirect("/");
     });
});

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug;

    Category.findOne({
        where:{
            slug: slug
        },
        include: {
            model: Article,
            required: true,
          }
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {categories : categories, articles: category.articles});
            })
        }
        else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    })
});

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

// CONNECT SERVER
app.listen(PORT, (err) => {
    if(err){
       console.log('Error loading server');
    }
    else{
        console.log(`Server is running in ${PORT}...`);
    }
});

