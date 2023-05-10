const express = require('express');
const slugify = require('slugify');
const Article = require('./Article');
const Category = require('../Categories/Category');

const router = express.Router();

router.get('/admin/articles', (req, res) => {
    Article.findAll({ 
        include: {
            model: Category,
            required: true,
          }
    })
        .then((articles) => {
            res.render('admin/articles/index', {articles : articles}).status(200);
        })
        .catch((err) => {
            res.send('Err: Not possible list articles!').status(401);
        });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories}).status(200);
    })
});

router.post('/admin/articles/register', (req, res) => {
    let title = req.body.title;
    let body = req.body.description;
    let categoryId = req.body.category;

    if(title != undefined){
        Article.create({
            title: title,
            slug: slugify(title),
            body: body, 
           categoryId: categoryId,
        }).then(() => {
            res.redirect('/admin/articles').status(200);
        }).catch((err) => {
            res.send('Err: The article not register!').status(401);
        }) ;
    }
    else{
        res.render('admin/articles');
    }
});

router.get('/admin/articles/alter/:id', (req, res) => {
    let id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/articles');
    }

    Article.findByPk(id).then(article => {
        if(article != undefined){
            res.render('admin/articles/alter' , {article : article }).status(200);
        }
        else{
            res.redirect('/admin/articles');
        }
    }).catch( err => {
        res.redirect('/admin/articles').status(401);
    })
})


router.post('/articles/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;

    Article.update({ title : title , slug: slugify(title)}, {
        where : {
            id: id
        }
    }).then(() => {
        res.status(200).redirect('/admin/articles');
    }).catch(() => {
        res.status(401).json({err : 'not update article'}).render('/admin/articles');
    })
})

router.post('/articles/delete', (req, res ) => {
    let id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles').status(200);
            })
        }
        else{
            res.redirect('/admin/articles');
        }
    }
    else{
        res.redirect('/admin/articles');
    }
})

module.exports = router;