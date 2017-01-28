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
    });

    app.post('/', function (req, res) {

    });

    app.get('/task/comments', (req, res) => {
        let id = req.get('taskId');

        db.getTaskComments(id, (err, recordset) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                console.log('recordset');
                res.json(recordset);
            }
        })
    })

    app.get('/tasks/todo', auth, (req, res) => {
        db.getTasksAssignedToUserOrderedByPriority(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err)
                res.sendStatus(401)
            } else {
                let data = {
                    tasks: recordset
                };
                console.log(data);
                res.json(data);
            }

        });
    });
    
    app.get('/user', auth, (req, res) => {

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

    app.post('/tasks/assignto', auth, (req, res) => {
        console.log('in /tasks/todo');
        console.log(req.user);
        db.getTasksAssignedToUserOrderedByPriority(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.json(recordset);
            }
        });
    });

    app.post('/user/req/employee', auth, (req, res) => {

    });

    app.post('/user/req/manager', auth, (req, res) => {

    });

    app.get('/user/req/employee', auth, (req, res) => {

    });

    app.get('/user/req/manager', auth, (req, res) => {

    })
}