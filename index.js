const express = require('express'),
    app = express(),
    Mustache = require('mustache'),
    sql = require('mssql'),
    fs = require('fs');

const dbConfig = JSON.parse(fs.readFileSync('./database_config.json', 'utf8'));

const Database = require('./database.js');

const db = new Database(dbConfig);

app.use('/scripts', express.static(__dirname + '/client/app/js'));
app.use('/styles', express.static(__dirname + '/client/app/css'));
app.use('/templates', express.static(__dirname + '/client/app/templates'));
app.use('/fonts', express.static(__dirname + '/client/app/fonts'));
app.use('/components', express.static(__dirname + '/client/bower_components'));

require('./auth')(app, db);
require('./api')(app, db);

const port = 27017;
app.listen(port, () => {
    console.log('Listeting at port ' + port);
});