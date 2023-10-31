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
            res.render('admin/articles/index', {articles : articles});
        })
        .catch((err) => {
            res.send('Err: Not possible list articles!');
        });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
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
            res.redirect('/admin/articles');
        }).catch((err) => {
            res.send('Err: The article not register!');
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
            Category.findAll( ).then(categories => {
                res.render('admin/articles/alter' , {article : article, categories: categories });
            })
        }
        else{
            res.redirect('/admin/articles');
        }
    }).catch( err => {
        res.redirect('/admin/articles');
    })
})


router.post('/articles/update', (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.description;
    let categoryId = req.body.category;

    Article.update({ 
        title : title,
        slug: slugify(title),
        categoryId: categoryId,
        body: body}, 
        {
        where : {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(() => {
        res.json({err : 'not update article'}).render('/admin/articles');
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
                res.redirect('/admin/articles');
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

router.get('/articles/page/:num', (req, res) => {
    let pageNotNum = req.params.num;
    let page = parseInt(pageNotNum);
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }
    else{
        offset = (page -1 )* 4; 
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        oder:[
            'id', 'DESC'
        ]
    }).then( articles => {
        
        var next;

        if(offset + 4 >= articles.count){
            next = false;
        }
        else{
            next = true;
        }        
        
        let result = {
            articles: articles,
            next: next,
            page: page
        }

        Category.findAll().then( categories => {
            res.render("admin/articles/page", {result: result, categories: categories});
        }).catch(err => {
            res.send(err)
        })

    })
})

module.exports = router;