module.exports = (app, db, passport = require('passport'), Strategy = require('passport-local')) => {
    const bodyParser = require('body-parser'),
        bcrypt = require('bcrypt');

    passport.use(new Strategy(
        (username, password, cb) => {
            db.getUserByUsername(username, (err, user) => {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    return cb(null, false);
                }
                bcrypt.compare(password, user.Password, (err, res) => {
                    if (err) {
                        return cb(err);
                    }
                    if (!res) {
                        return cb(null, false);
                    }
                    return cb(null, user);
                });
                /*if (user.Password != password) {
                    return cb(null, false);
                }*/
            });
        }));

    passport.serializeUser(function (user, cb) {
        cb(null, user.Username);
    });

    passport.deserializeUser((username, cb) => {
        db.getUserByUsername(username, (err, user) => {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(require('./sql-validation'));
    app.use(require('cookie-parser')());
    app.use(require('express-session')({
        secret: 'taina maina',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login', passport.authenticate('local'), (req, res) => {
        res.status(200).json({msg: 'brau'})
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.post('/signin', (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let confirm = req.body.confirm;

        if (password === confirm) {
            let user = {
                username: username,
                password: password
            }
            db.insertUser(user, (err) => {
                console.log(err)
                if (err) {
                    console.log('In error');
                    res.status(500).json({
                        err: "Username taken."
                    });
                } else {
                    res.status(200).json({
                        msg: "Success!"
                    });
                }
            });
        } else {
            res.status(500).json({
                err: "Password and confirm password do not match."
            });
        }
    });
}