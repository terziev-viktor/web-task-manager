module.exports = (app, db) => {
    const auth = (req, ers, next) => {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    app.get('/', (req, res) => {

        res.sendStatus(200);
        console.log(req.user);
    });

    app.post('/', function (req, res) {

    });
}