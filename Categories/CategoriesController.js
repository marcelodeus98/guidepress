const express = require('express');
const slugify = require('slugify');
const Category = require('./Category');

const router = express.Router();

router.get('/admin/categories', (req, res) => {
    Category.findAll()
                    .then((categories) => {
                        res.render('admin/categories/index', {
                            categories: categories
                        }).status(200);
                    })
                    .catch((err) => {
                        res.send('Err: Not possible list categories!').status(401);
                    });
});

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new').status(200);
});

router.post('/admin/categories/register', (req, res) => {
    let title = req.body.title;

    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            console.log('Sucessfull register');
            res.redirect('/admin/categories').status(200);
        }).catch((err) => {
            res.send('Err: The category not register!').status(401);
        }) ;
    }
    else{
        res.render('admin/categories/new');
    }
});

router.get('/admin/categories/alter/:id', (req, res) => {
    let id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories');
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render('admin/categories/alter', {category: category}).status(200);
        } 
        else{
            res.redirect('/admin/categories');
        }
    }).catch(err => {
        res.redirect("/admin/categories").status(401);
    });
});

router.post('/categories/update', (req, res) => {
    let id = req.body.id;   
    let title = req.body.title;

    Category.update({title : title, slug: slugify(title)}, {
        where: {
            id : id
        }
    }).then(() => {
        res.status(200).redirect('/admin/categories');
    }).catch(() => {
        res.status(401).json({err : 'not update category'}).render('/admin/categories');
    })
});

router.post('/categories/delete', (req, res) => {
    let id = req.body.id;
    
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories').status(200);
            })
        }
        else{
            res.redirect('/admin/categories');
        }
    }
    else{
        res.redirect('/admin/categories');
    }
})

module.exports = router;