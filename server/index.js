const express = require('express'),
    app = express(),
    Mustache = require('mustache'),
    sql = require('mssql'),
    fs = require('fs'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '__' + file.originalname)
        }
    }),
    upload = multer({
        storage: storage
    });

// parsing the database configuration file
const dbConfig = JSON.parse(fs.readFileSync(__dirname + '/database_config.json', 'utf8'));

const Database = require('./database.js');

// database abstraction object
const db = new Database(dbConfig);

// authentication module
require('./auth')(app, db, io);

// authentication middleware function
const auth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
    } else {
        next();
    }
}

// api modules
require('./api')(app, db, auth, upload);

const pathToClientFolder = path.join(__dirname, '/../', '/client/');

// static paths
require('./static-paths')(express, app, auth, pathToClientFolder);

const port = 27017;
module.exports = http.listen(port, () => {
    console.log('Listeting at port ' + port);
});
