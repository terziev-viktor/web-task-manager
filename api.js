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
            if (err) {
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

    app.get('/search', (req, res) => {
        db.getUsersByUsernamePart(req.query.text, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.json(recordset);
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

    // Current user becomes employee of user from req.body
    app.post('/user/employee', auth, (req, res) => {
        db.insertUserManager(req.user.Username, req.body.Username, (err, recordser) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.sendStatus(200);
            }
        });
    });

    // Current user becomes manager of user from req.body
    app.post('/user/manager', auth, (req, res) => {
        db.insertUserManager(req.body.Username, req.user.Username, (err, recordser) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.sendStatus(200);
            }
        });
    });

    app.get('/tasks/assignedto', auth, (req, res) => {
        db.getTasksAssignedToUserOrderedByPriority(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.json(recordset);
            }
        });
    });

    app.get('/user/employees', auth, (req, res) => {
        db.getUserEmployees(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.json(recordset);
            }
        })
    });

    app.get('/user/managers', auth, (req, res) => {
        db.getUserManagers(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.json(recordset);
            }
        })
    });

    app.post('/task', auth, (req, res) => {
        let task = req.body;
        task.Creator_Username = req.user.Username;
        db.insertTask(task, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                console.log(recordset);
                let taskId = recordset[0].TaskId;
                db.assignUsersToTask(taskId, task.AssigneTo, (err, innerRecordset) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(401);
                    } else {
                        res.sendStatus(200);
                    }
                })
            }
        });
    });

    app.post('/user/req/colleague', auth, (req, res) => {
        db.insertColleagueReuqest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.sendStatus(200);
            }
        });
    });

    app.post('/user/req/employee', auth, (req, res) => {
        db.insertEmployeeRequest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.sendStatus(200);
            }
        })
    });

    app.post('/user/req/manager', auth, (req, res) => {
        db.insertManagerRequest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.sendStatus(200);
            }
        })
    });

    app.get('/user/req/employee', auth, (req, res) => {
        db.getUserRecievedEmployeeRequests(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.json(recordset);
            }
        });
    });

    app.get('/user/req/manager', auth, (req, res) => {
        db.getUserRecievedManagerRequests(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                res.json(recordset);
            }
        });
    })
}