const express = require('express'),
    app = express(),
    Mustache = require('mustache'),
    sql = require('mssql'),
    bodyParser = require('body-parser'),
    sqlinjection = require('sql-injection'),
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
            if (user.password != password) {
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

app.use(sqlinjection);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(require('morgan')('combined'));
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

app.get('/', (req1, res) => {
    res.sendFile(__dirname + '/views/' + 'home.html');
});

app.post('/login', (req, res) => {
    console.log(req.body)
    res.end();
});

app.post('/signin', (req, res) => {

});

app.listen(27017, () => {
    console.log('Listeting at port 27017')
});