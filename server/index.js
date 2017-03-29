const express = require('express'),
    app = express(),
    Mustache = require('mustache'),
    sql = require('mssql'),
    fs = require('fs'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path');

// parsing the database configuration file
const dbConfig = JSON.parse(fs.readFileSync(__dirname + '/database_config.json', 'utf8'));

const Database = require('./database.js');

// database abstraction object
const db = new Database(dbConfig);

const pathToClientFolder = path.join(__dirname, '/../', '/client/');

// initialize static paths
app.use('/scripts', express.static(path.join(pathToClientFolder, '/app/', '/js')));
app.use('/styles', express.static(path.join(pathToClientFolder, '/app/', '/css')));
app.use('/templates', express.static(path.join(pathToClientFolder, '/app/', '/templates')));
app.use('/fonts', express.static(path.join(pathToClientFolder, '/app/', '/fonts')));
app.use('/components', express.static(path.join(pathToClientFolder, '/bower_components')));
app.use('/images', express.static(path.join(pathToClientFolder, '/app/' + '/img')));
app.use('/favicon', express.static(path.join(pathToClientFolder, '/app/', '/img/' + '/icons' + '/favicon.ico')));
app.use('/frontpage', express.static(path.join(pathToClientFolder, '/frontpage')));

// authentication and api modules
require('./auth')(app, db, io);
require('./api')(app, db);

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(pathToClientFolder, '/app/', '/index.html'));
    } else {
        res.sendFile(path.join(pathToClientFolder, '/frontpage/', '/index.html'));
    }
});

const port = 27017;
module.exports = http.listen(port, () => {
    console.log('Listeting at port ' + port);
});
