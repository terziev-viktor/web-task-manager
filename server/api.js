module.exports = (app, db) => {
    const auth = (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }

    app.use('/task', auth);
    app.use('/task', require('./api/task')(db));

    app.use('/tasks', auth);
    app.use('/tasks', require('./api/tasks')(db));

    app.use('/user', auth);
    app.use('/user', require('./api/user')(db))

    app.get('/search', (req, res) => {
        if (req.query.taskTodo !== undefined) {
            db.filter.tasksTodo(req.user.Username, req.query.tasksTodo, (err, recordset) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({msg: 'Could not filter tasks.'});
                } else {
                    res.status(200).json(recordset);
                }
            });
        } else if (req.query.tasksCreated !== undefined) {
            db.filter.tasksCreated(req.user.Username, req.query.tasksCreated, (err, recordset) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({msg: 'Could not filter tasks.'});
                } else {
                    res.status(200).json(recordset);
                }
            });
        } else if (req.query.colleagues !== undefined) {
            db.filter.colleagues(req.user.Username, req.query.colleagues, (err, recordset) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({msg: 'Could not filter colleagues.'});
                } else {
                    res.status(200).json(recordset);
                }
            });
        } else if (req.query.employees !== undefined) {
            db.filter.employees(req.user.Username, req.query.employees, (err, recordset) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({msg: 'Could not filter employees.'});
                } else {
                    res.status(200).json(recordset);
                }
            });
        } else if (req.query.managers !== undefined) {
            db.filter.managers(req.user.Username, req.query.managers, (err, recordser) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({msg: 'Could not filter managers.'});
                } else {
                    res.status(200).json(recordset);
                }
            });
        } else {
            db.get.usersByUsernamePart(req.query.text, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not get users.'
                    });
                } else {
                    res.json(recordset);
                }
            });
        }
    });
}