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

app.get('/', (req, res) => {
    res.sendFile(path.join(pathToClientFolder, '/app/', '/index.html'));
});

// authentication and api modules
require('./auth')(app, db, io);
require('./api')(app, db);

const port = 27017;
module.exports = http.listen(port, () => {
    console.log('Listeting at port ' + port);
});
