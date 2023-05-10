const express = require('express');
const bodyParser = require('body-parser');

// FILE CONTROLLERS
const articlesController = require('./Articles/ArticlesController');
const categoriesController = require('./Categories/CategoriesController');

const app = express();

// Files Database
const Article = require('./Articles/Article');
const Category = require('./Categories/Category');

let PORT = 8080;

// Use EJS 
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Use body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// ROUTES
app.get('/', (req, res)=> {
    res.render('index');
});

app.use('/', categoriesController);
app.use('/', articlesController);

// CONNECT SERVER
app.listen(PORT, (err) => {
    if(err){
       console.log('Error loading server');
    }
    else{
        console.log(`Server is running in ${PORT}...`);
    }
});

