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

    app.get('/user', auth, (req, res) => {
        res.json(req.user.Username);
    });

    app.get('/task/:taskId', auth, (req, res) => {
        db.getTaskById(req.params.taskId, (err, task) => {
            if(err) {
                console.log(err);
                res.status(500).json({msg: 'Could not get task'});
            } else {
                res.status(200).json(task);
            }
        });
    });

    app.post('/task/:taskId/new-progress', auth, (req, res) => {
        let taskId = req.params.taskId;
        let newProgress = req.body.newProgress;
        
        db.updateTaskProgress(taskId, newProgress, (err, task) => {
            if(err) {
                res.status(500).json({msg: 'Could not update task...'});
            } else {
                res.status(200).json({msg: 'Progress set to ' + newProgress});
            }
        });
    });

    app.get('/task/:taskId/comments', auth, (req, res) => {
        let id = req.params.taskId;

        db.getTaskComments(id, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({msg: 'Could not get task comments'});
            } else {
                res.status(200).json(recordset);
            }
        });
    });

    app.get('/task/:taskId/assignedUsers', auth, (req, res) => {
        // TODO: IMPLEMENT
        db.getTaskAssignedUsersOrderedByUsername(req.params.taskId, (err, recordset) => {
            if(err) {
                res.status(500).json({msg: "Could not get task's assigned users."});
            } else {
                res.status(200).json(recordset);
            }
        });
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

    app.get('/tasks/todo/:username', auth, (req, res) => {
        db.getTasksAssignedToUserOrderedByPriority(req.params.username, (err, recordset) => {
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
                res.status(500).json({msg: 'Could not get users.'});
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
    app.get('/tasks/created/:username', auth, (req, res) => {
        db.getUserCreatedTasksOrderByPriority(req.params.username, (err, recordset) => {
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
                res.status(200).json({msg: 'User inserted to managers'});
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
                res.status(200).json('User ' + req.body.Username + ' added to managers.');
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

    app.get('/user/employees/:username', auth, (req, res) => {
        db.getUserEmployees(req.params.username, (err, recordset) => {
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

    app.get('/user/managers/:username', auth, (req, res) => {
        db.getUserManagers(req.params.username, (err, recordset) => {
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
        if (!task.Title.length > 0) {
            res.status(500).json({ err: 'Please insert a title for the task.' });
        } else {
            task.Creator_Username = req.user.Username;
            db.insertTask(task, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(401);
                } else {
                    let taskId = recordset[0].TaskId;
                    db.assignUsersToTask(taskId, task.AssigneTo, (err, innerRecordset) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(401);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                }
            });
        }

    });

    app.post('/user/colleagues', auth, (req, res) => {
        
        db.insertColleagues(req.user.Username, req.body.Username, (err, recordser) => {
            if (err) {
                console.log(err);
                res.status(500).json({msg: 'You are already colleague  with ' + req.body.Username});
            } else {
                res.status(200).json({msg: 'User ' + req.body.Username + ' added to colleagues'});
            }
        });
    });

    app.get('/user/colleagues', auth, (req, res) => {
        db.getUserColleagues(req.user.Username, (err, recordset) => {
            if (err) {
                res.status(500).json({ msg: 'DB error while executing function GetUserColleagues' });
            } else {
                res.json(recordset);
            }
        });
    });

    app.get('/user/req/colleague', auth, (req, res) => {
        db.getUserColleagueRequests(req.user.Username, (err, recordset) => {
            if (err) {
                res.status(500).json({msg: 'Could not get colleague requests.'});
            } else {
                res.json(recordset);
            }
        });
    });

    app.post('/user/req/colleague', auth, (req, res) => {
        db.insertColleagueReuqest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                res.status(500).json({ msg: 'Could not send colleague request.' });
            } else {
                res.status(200).json({msg: 'Request sent to ' + req.body.Username});
            }
        });
    });

    app.post('/user/req/employee', auth, (req, res) => {
        db.insertEmployeeRequest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                res.status(500).json({ msg: 'Could not send employee request.' });
            } else {
                res.status(200).json({msg: 'Request sent to ' + req.body.Username});
            }
        })
    });

    app.post('/user/req/manager', auth, (req, res) => {
        db.insertManagerRequest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: 'Could not send manager request.' });
            } else {
                res.status(200).json({ msg: 'Request sent to ' + req.body.Username});
            }
        })
    });

    app.get('/user/req/employee', auth, (req, res) => {
        db.getUserRecievedEmployeeRequests(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: 'Could not get employee requests' });
            } else {
                res.json(recordset);
            }
        });
    });

    app.get('/user/req/manager', auth, (req, res) => {
        db.getUserRecievedManagerRequests(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: 'Could not get manager requests' });
            } else {
                res.json(recordset);
            }
        });
    });

    // UPDATE TASK
    app.post('/task/:taskId', auth, (req, res) => {
        let data = req.body;
        let newTask = {};
        console.log('update task: /task/:taskId');
        console.log(data);

        db.getTaskById(req.params.taskId, (err, task) => {
            if (task.Creator_Username !== req.user.Username) {
                res.status(400).json({ msg: 'You can only edit your own tasks.' });
            } else {
                newTask.Title = data.Title ? data.Title : task.Title;
                newTask.Description = data.Description ? data.Description : task.Description;
                newTask.Deadline = data.Deadline ? data.Deadline : task.Deadline;
                newTask.Progress = data.Progress ? data.Progress : task.Progress;
                if (newTask.Progress == 100) {
                    newTask.IsDone = 1;
                }
                newTask.Priority = data.Priority ? data.Priority : task.Priority;
                newTask.Repeatability = data.Repeatability ? data.Repeatability : task.Repeatability;
                db.updateTaks(taskId, newTask, (err, recordset) => {
                    if (err) {
                        res.status(500).json({ msg: 'Could not update task.' });
                    } else {
                        res.status(200).json({ msg: 'Updated task successfully' });
                    }
                });
            }
        });
    });
}