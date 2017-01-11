const express = require('express'),
    app = express(),
    Mustache = require('mustache'),
    sql = require('mssql'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    passport = require('passport'),
    Strategy = require('passport-local');

const dbConfig = JSON.parse(fs.readFileSync('database_config.json', 'utf8'));

const Database = require("./database.js");

const db = new Database(dbConfig);

passport.use(new Strategy(
    (username, password, cb) => {
        db.getUserByUsername(username, (err, user) => {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            if (user.Password != password) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.Username);
});

passport.deserializeUser((username, cb) => {
    db.getUserByUsername(username, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({
    secret: 'taina maina',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/scripts', express.static(__dirname + '/views/' + '/bower_components/'));
app.use('/styles', express.static(__dirname + '/css/'))

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/views/' + 'home.html');
    // logged in user will be attached to req
    console.log(req.user);
});

app.post('/', function (req, res) {

});


app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/'
    }),
    (req, res) => {
        res.redirect('/');
        //console.log(req);

    });

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/signin', (req, res) => {
    console.log(req.body)
    let username = req.body.username;
    let password = req.body.password;
    let confirm = req.body.confirm;

    if (password === confirm) {
        let user = {
            username: username,
            password: password
        }
        db.insertUser(user, (err) => {
            console.log(err)
            if (err) {
                res.json({
                    msg: "Username taken."
                });
            } else {
                res.json({
                    msg: "Success!"
                })
            }
        });
    } else {
        res.json({
            msg: "Password and confirm password do not match."
        });
    }
});

const port = 27017;
app.listen(port, () => {
    console.log('Listeting at port ' + port);
});