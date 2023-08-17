const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./Users');

const router = express.Router();

router.get('/login/user'
+, (req, res) => {
    res.render('admin/users/login');
});

router.post('/autenticate', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ where:{ email: email}}).then( user => {
        if(user != undefined){
            let correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }

                res.json(req.session.user);
            }
            else{
                res.redirect('/login');
            }
        }
        else{
            res.redirect('/login');
        }
    })
});

router.get('/admin/users', (req, res) => {
    User.findAll()
                    .then((users) => {
                        res.render('admin/users/index', {
                            users: users
                        }).status(200);
                    })
                    .catch((err) => {
                        res.send('Err: Not possible list users!').status(401);
                    });
});


router.get('/admin/users/new', (req, res) => {
    res.render('admin/users/new');
});

router.post('/admin/users/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where:{ email:email }}).then( user => {
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10);
            
            User.create({
                email: email,
                password: bcrypt.hashSync(password, salt),
            }) 
            .then(() => {
                res.send('Ok! User register!');
            }).catch((err) => {
                res.status(401).send('Err: The user not register!');
            });
        }
        else{
            res.redirect('/admin/users/new');
        }
    })

});
 
module.exports = router;