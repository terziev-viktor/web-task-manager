const express = require('express'),
    $ = require('jquery'),
    app = express(),
    Mustache = require('mustache');

app.use('/scripts', express.static(__dirname + '/bower_components/'));
app.use('/styles', express.static(__dirname + '/css/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/' + 'home.html');
    
})

app.listen(27017, () => {
    console.log('Listeting at port 27017')
})