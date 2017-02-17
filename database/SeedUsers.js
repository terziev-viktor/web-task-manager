const fs = require('fs');

const dbConfig = JSON.parse(fs.readFileSync('./database_config.json', 'utf8'));

const Database = require('../database.js');

const db = new Database(dbConfig);

let users = [];

function insertUser(username, password) {
    users.push({
        username: username,
        password: password
    });
}

insertUser('Boiko', '121246323456');

insertUser('Gosho', '213562');

insertUser('Marko', '75345');

insertUser('Minka', '6436');

insertUser('MITKO', 'P@55W0RD345');

insertUser('Pesho', '123456');

insertUser('Sashko', '87523');

insertUser('Stamat', '768563254');

insertUser('Stanimir', '532432');

insertUser('Stefan', '1235326');

insertUser('Yordan', '124732');

users.forEach((user) => db.insert.user(user, (err) => {
    if (err) {
        console.log(err);
    }
}));
