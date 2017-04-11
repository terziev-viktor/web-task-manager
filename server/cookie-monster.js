const randomstring = require('randomstring');

module.exports = class CookieMonster {
    constructor(database, cookieSize) {
        this.db = database;
        this.cookieSize = !cookieSize ? 40 : cookieSize;

        this.consumeCookie = (cookie, cb) => {
            this.db.logins.find(cookie, (err, recordset) => {
                if (err || !recordset) {
                    cb(err);
                    return;
                }
                if(recordset.length == 0) {
                    cb(null, null);
                }
                let user = recordset[0];
                this.db.logins.delete(cookie, (innerErr) => {
                    if (innerErr) {
                        cb(innerErr);
                    } else {
                        cb(null, {
                            Username: user.Username,
                            FullName: user.FullName
                        });
                    }
                });
            });
        }

        this.getCookie = (user, done) => {
            let cookie = randomstring.generate(this.cookieSize);

            this.saveCookie(cookie, user.Username, user.FullName, (err) => {
                if (err) {
                    return done(err);
                } else {
                    return done(null, cookie);
                }
            });
        }

        this.deleteCookie = (cookieId, cb) => {
            this.db.logins.delete(cookieId, cb);
        }

        this.saveCookie = (cookie, username, fullname, cb) => {
            this.db.logins.insert(cookie, username, fullname, cb);
        }
    }
}