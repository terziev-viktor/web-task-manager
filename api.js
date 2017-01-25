module.exports = (app, db) => {
    const auth = (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/client' + '/app' + '/index.html');
        console.log(req.user);
    });

    app.post('/', function (req, res) {

    });

    app.get('/tasks/todo', auth, (req, res) => {
        db.getTasksAssignedToUserOrderedByPriority(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err)
                res.sendStatus(401)
            } else {
                let data = {
                    tasks: recordset
                };

                res.json(data);
            }

        });
    });

    app.get('/tasks/created', auth, (req, res) => {
        db.getUserCreatedTasksOrderByPriority(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err)
                res.sendStatus(401)
            } else {
                let data = {
                    tasks: recordset
                };

                res.json(data);
            }

        });
    });

    app.get('/user', auth, (req, res) => {
        
    });

    app.post('/tasks/assignto', auth, (req, res) => {

    });

    app.post('/user/req/employee', auth, (req, res) => {

    });

    app.post('/user/req/employer', auth, (req, res) => {

    });

    app.get('/user/req/employee', auth, (req, res) => {

    });

    app.get('/user/req/employer', auth, (req, res) => {

    })
}