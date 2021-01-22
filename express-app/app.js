const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const mongoose = require('mongoose');

const errorController = require('./controllers/errors');

const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use((req, res, next) => {
    User.findByUserName('murtekbey')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            console.log(req.user);
            next();
        })
        .catch(err => {
            console.log(err);
        });
});
*/

// Routes
app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404Page);
/*
mongoConnect(() => {

    User.findByUserName('murtekbey')
        .then(user => {
            if (!user) {
                user = new User('murtekbey', 'murtekbey@gmail.com');
                return user.save();
            }
            return user;
        })
        .then(user => {
            console.log(user);
            app.listen(3000);
        })
        .catch(err => {
            console.log(err);
        });
});
*/

mongoose.connect("mongodb+srv://murtekbey:r8AW43GJ8gSWjmpm@cluster0.itzmu.mongodb.net/node-app?retryWrites=true&w=majority")
    .then(() => {
        console.log('connected to mongodb');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });