const express = require('express'),
    app = express(),
    Mustache = require('mustache'),
    sql = require('mssql'),
    bodyParser = require('body-parser'),
    sqlinjection = require('sql-injection');

const config = {
    server: "localhost\\SQLEXPRESS",
    database: "WebTaskManager",
    user: "sa",
    password: "123456",
    port: 1433,
    option: {
        encrypt: false
    }
};

// const Database = require("./database.js");

// const db = new Database(config);

// db.getUsersByUsernamePart("es", (err, recordset) => {
//     console.log(err)
//     console.log(recordset)
// })

app.use(sqlinjection);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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