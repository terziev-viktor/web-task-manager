module.exports = (app, db, io, passport = require('passport'), LocalStrategy = require('passport-local').Strategy, RememberMeStrategy = require('passport-remember-me').Strategy) => {
    const bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        bcrypt = require('bcrypt'),
        CookieMonster = require('./cookie-monster.js'),
        cm = new CookieMonster(db, 50);

    // passport user serialization
    passport.serializeUser((user, cb) => {
        cb(null, user.Username);
    });

    // passport user deserialization
    passport.deserializeUser((username, cb) => {
        db.get.userByUsername(username, (err, user) => {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });

    // passport local authentication Strategy
    passport.use(new LocalStrategy(
        (username, password, cb) => {
            db.get.userByUsername(username, (err, user) => {
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
            });
        }));

    // passport remember me
    passport.use(new RememberMeStrategy(
        (cookie, done) => {
            cm.consumeCookie(cookie, (err, data) => {
                
                if (err) {
                    return done(err);
                }
                if (!data) {
                    return done(null, false);
                }
                db.get.userByUsername(data.Username, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
            });
        },
        cm.getCookie
    ));

    // body parsing, cookie parsing and sql validation middleware
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(require('./sql-validation'));
    app.use(cookieParser());
    app.use(require('express-method-override')());
    app.use(require('express-session')({
        secret: 'LisyrfOzXS',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.authenticate('remember-me'));

    app.post('/login', passport.authenticate('local'), (req, res, next) => {
        if (!req.body.remember_me) {
            return next();
        }

        cm.getCookie(req.user, (err, cookie) => {
            if (err) {
                return next(err);
            }
            res.cookie('remember_me', cookie, {
                path: '/',
                httpOnly: true,
                maxAge: 604800000
            });
            res.cookie('currentUsername', req.user.Username, {
                path: '/',
                httpOnly: true,
                maxAge: 604800000
            });
            res.cookie('fullname', req.user.FullName, {
                path: '/',
                httpOnly: true,
                maxAge: 604800000
            });
            return next();
        });
    }, (req, res) => {
        res.status(200).json({
            username: req.user.Username,
            fullname: req.user.FullName
        });
    });

    // logout user
    app.get('/logout', (req, res) => {
        let cookie = req.cookies.remember_me;
        cm.deleteCookie(cookie, (err) => {
            if(err) {
                console.log(err);
            }
        });
        res.clearCookie('remember_me');
        req.logout();
        res.sendStatus(200);
    });

    // registers new user
    app.post('/sign_up', (req, res) => {
        let username = req.body.username;
        let fullname = req.body.fullname;
        let password = req.body.password;
        let confirm = req.body.confirm;
        if (password !== confirm) {
            res.status(403).json({
                msg: "Password and confirm password do not match.",
                errCode: 0 // errCode -> use to handle error in the right way
            });
            return;
        }

        if (password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!#$%?\-\_+=&*@><]{8,}$/g) === null) {
            res.status(403).json({
                msg: "Password must match minimum 8 characters at least 1 Alphabet, 1 Number and 1 Special Character",
                errCode: 1
            });
            return;
        }

        let user = {
            username: username,
            password: password,
            fullname: fullname
        }
        db.insert.user(user, (err) => {
            console.log(err)
            if (err) {
                console.log('In error');
                res.status(403).json({
                    msg: "Username taken.",
                    errCode: 2
                });
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.status(200).json({
                        user: req.user.Username
                    });
                });
            }
        });
    });


    // io auth
    require('socketio-auth')(io, {
        authenticate: function (socket, data, cb) {
            //get credentials sent by the client 
            let username = data.username;
            let password = data.password;

            db.get.userByUsername(username, (err, user) => {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    return cb(new Error('User not found'));
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
            });
        }
    });
}