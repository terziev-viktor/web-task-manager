// users are seeded with node because the passwords
// are encrypted with the npm module bcrypt

const fs = require('fs');

const dbConfig = JSON.parse(fs.readFileSync('../server/database_config.json', 'utf8'));

const Database = require('../server/database.js');

const db = new Database(dbConfig);

let users = [];

function insertUser(username, fullname, password) {
    users.push({
        username: username,
        password: password,
        fullname: fullname
    });
}

insertUser('Boiko', 'Бойко Голямов Морков', '121246323456');

insertUser('Gosho', 'Георги Георгиев Георгиев', '213562');

insertUser('Marko', 'Марко Поло Полов', '75345');

insertUser('Minka', 'Мирела Бончева Стоилова', '6436');

insertUser('MITKO', 'Митко Алкохолиев Тютюнев', 'P@55W0RD345');

insertUser('Pesho', 'Пешо Марков Компютърджиев', '123456');

insertUser('Sashko', 'Александър Башев Скриптов', '87523');

insertUser('Stamat', 'Стамат Стаматов Футболистов', '768563254');

insertUser('Stanimir', 'Станимир Седналов Пенчев', '532432');

insertUser('Stefan', 'Стефан Стамболов Апостолов', '1235326');

insertUser('Yordan', 'Йордан Йорданов Балкански', '124732');

users.forEach((user) => db.insert.user(user, (err) => {
    if (err) {
        console.log(err);
    }
}));
