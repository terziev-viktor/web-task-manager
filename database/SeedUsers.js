const fs = require('fs');

const dbConfig = JSON.parse(fs.readFileSync('./database_config.json', 'utf8'));

const Database = require('../database.js');

const db = new Database(dbConfig);

let users = [];

function insertUser(username, fullname, password) {
    users.push({
        username: username,
        password: password,
        fullname: fullname
    });
}

insertUser('Boiko1', 'Бойко Голямов Морков', '121246323456');

insertUser('Gosho1', 'Георги Георгиев Георгиев', '213562');

insertUser('Marko1', 'Марко Поло Полов','75345');

insertUser('Minka1','Мирела Тя Маприиба', '6436');

insertUser('MITKO1', 'Митко Алкохолиев Тютюнев', 'P@55W0RD345');

insertUser('Pesho22', 'Пешо Марков Компютърджиев', '123456');

insertUser('Sashko1', 'Александър Мозъков Грахозърнов', '87523');

insertUser('Stamat1', 'Стамат Стаматов Футболистов', '768563254');

insertUser('Stanimir1','Станимир Седналов Хитлеров', '532432');

insertUser('Stefan1', 'Стефан Стамболов Апостолов', '1235326');

insertUser('Yordan1', 'Йордан Йорданов Балкански', '124732');

users.forEach((user) => db.insert.user(user, (err) => {
    if (err) {
        console.log(err);
    }
}));
