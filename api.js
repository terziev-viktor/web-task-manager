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

    app.post('/task/:taskId/new-progress', auth, (req, res) => {
        let taskId = req.params.taskId;
        let newProgress = req.body.newProgress;
        db.update.taskProgress(taskId, newProgress, (err, task) => {
            if (err) {
                res.status(500).json({
                    msg: 'Could not update task...'
                });
            } else {
                res.status(200).json({
                    msg: 'Progress set to ' + newProgress
                });
            }
        });
    });

    app.post('/task/:taskId/comments', auth, (req, res) => {

        db.insert.comment(req.body.content, req.user.Username, req.params.taskId, (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not post the comment.'
                });
            } else {
                res.status(200).json({
                    msg: 'Comment posted.'
                });
            }
        });
    });

    app.get('/task/:taskId/comments', auth, (req, res) => {
        let id = req.params.taskId;

        db.get.taskComments(id, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not get task comments'
                });
            } else {
                res.status(200).json(recordset);
            }
        });
    });

    app.get('/task/:taskId/assignedUsers', auth, (req, res) => {
        db.get.taskAssignedUsersOrderedByUsername(req.params.taskId, (err, recordset) => {
            if (err) {
                res.status(500).json({
                    msg: "Could not get task's assigned users."
                });
            } else {
                res.status(200).json(recordset);
            }
        });
    });

    app.get('/tasks/todo', auth, (req, res) => {
        if (req.query.getCount !== undefined) {
            db.get.tasksToDoCount(req.user.Username, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(401).redirect('/');
                } else {
                    let data = recordset[0];
                    res.status(200).json(data);
                }
            });
        } else {
            db.get.tasksAssignedToUserOrderedByPriority(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(401).redirect('/');
                } else {
                    let data = {
                        tasks: recordset
                    };
                    res.json(data);
                }

            });
        }
    });

    app.get('/tasks/todo/:username', auth, (req, res) => {
        db.get.tasksAssignedToUserOrderedByPriority(req.params.username, (err, recordset) => {
            if (err) {
                console.log(err)
                res.status(401).redirect('/');
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
    });

    app.get('/tasks/created', auth, (req, res) => {
        if (req.query.getCount !== undefined) {
            db.get.userTasksCreatedCount(req.user.Username, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(401).redirect('/');
                } else {
                    let data = recordset[0];
                    res.json(data);
                }
            });
        } else {
            db.get.userCreatedTasksOrderByPriority(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(401).redirect('/');
                } else {
                    let data = {
                        tasks: recordset
                    };

                    res.status(200).json(data);
                }

            });
        }
    });

    app.get('/tasks/created/:username', auth, (req, res) => {
        db.get.userCreatedTasksOrderByPriority(req.params.username, (err, recordset) => {
            if (err) {
                console.log(err)
                res.status(401).redirect('/');
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
        if (req.query.remove !== undefined) {
            db.remove.userEmployee(req.user.Username, req.query.remove, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not remove ' + req.query.remove + ' from employees'
                    });
                } else {
                    res.status(200).json({
                        msg: req.query.remove + ' removed from employees'
                    });
                }
            });
        } else {
            db.insert.userManager(req.user.Username, req.body.Username, (err, recordser) => {
                if (err) {
                    console.log(err);
                    res.status(401).redirect('/');
                } else {
                    res.status(200).json({
                        msg: 'User inserted to managers'
                    });
                }
            });
        }
    });

    // Current user becomes manager of user from req.body OR removing manager
    app.post('/user/manager', auth, (req, res) => {
        if (req.query.remove !== undefined) {
            let managerToRemove = req.query.remove
            db.remove.userManager(req.user.Username, managerToRemove, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not remove ' + managerToRemove + ' from managers.'
                    });
                } else {
                    res.status(200).json({
                        msg: managerToRemove + ' removed from managers.'
                    });
                }
            });
        } else {
            db.insert.userManager(req.body.Username, req.user.Username, (err, recordser) => {
                if (err) {
                    console.log(err);
                    res.status(401).redirect('/');
                } else {
                    res.status(200).json('User ' + req.body.Username + ' added to managers.');
                }
            });
        }
    });

    // from = from whitch row, size = how many elements (size = -1 to get all elements)
    app.get('/user/employees', auth, (req, res) => {
        db.get.userEmployees(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(401).redirect('/');
            } else {
                res.json(recordset);
            }
        });
    });

    app.get('/user/employees/:username', auth, (req, res) => {
        db.get.userEmployees(req.params.username, req.query.from, req.query.size, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(401).redirect('/');
            } else {
                res.json(recordset);
            }
        })
    });

    app.get('/user/managers', auth, (req, res) => {

        db.get.userManagers(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(401).redirect('/');
            } else {
                res.json(recordset);
            }
        });

    });

    app.get('/user/managers/:username', auth, (req, res) => {
        db.get.userManagers(req.params.username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(401).redirect('/');
            } else {
                res.json(recordset);
            }
        })
    });

    // doesn't check for permissions
    function assignUserToTask(req, res, taskId, assignTo) {
        db.assign.usersToTask(taskId, assignTo, (err, innerRecordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    err: 'Cannot assign task to user'
                });
            } else {
                res.status(200).json({
                    msg: 'Assignment successful!'
                });
            }
        });
    }

    app.post('/task', auth, (req, res) => {
        let task = req.body;
        if (!task.Title.length > 0) {
            res.status(500).json({
                err: 'Please insert a title for the task.'
            });
        } else {
            task.Creator_Username = req.user.Username;
            db.insert.task(task, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(401);
                } else {
                    let taskId = recordset[0].TaskId;
                    assignUserToTask(req, res, taskId, task.AssigneTo);
                }
            });
        }

    });

    app.post('/task/assign_user', auth, (req, res) => {
        const assignTo = req.body.assignTo,
            taskId = req.body.taskId;
        db.get.taskById(taskId, (err, task) => {
            if (err) {
                console.log(err);
                res.sendStatus(401);
            } else {
                if (req.user.Username === task.Creator_Username) {
                    assignUserToTask(req, res, taskId, assignTo);
                } else {
                    res.sendStatus(401);
                }
            }
        });
    });

    app.post('/user/colleagues', auth, (req, res) => {
        if (req.query.remove === 'true') {
            db.remove.colleague(req.user.Username, req.body.Username, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not remove colleague...'
                    });
                } else {
                    res.status(200).json({
                        msg: 'Removed ' + req.body.Username + ' from colleagues.'
                    });
                }
            });
        } else {
            db.insert.colleagues(req.user.Username, req.body.Username, (err, recordser) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'You are already colleague  with ' + req.body.Username
                    });
                } else {
                    res.status(200).json({
                        msg: 'User ' + req.body.Username + ' added to colleagues'
                    });
                }
            });
        }
    });

    app.get('/user/colleagues', auth, (req, res) => {
        if (req.query.getCount !== undefined) {
            db.get.userColleaguesCount(req.user.Username, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not retrieve the count of your colleagues.'
                    });
                } else {
                    res.json(recordset[0]);
                }
            });
        } else {
            db.get.userColleagues(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not retrieve your colleagues'
                    });
                } else {
                    res.json(recordset);
                }
            });
        }
    });

    app.get('/user/req/colleague', auth, (req, res) => {
        db.get.userColleagueRequests(req.user.Username, (err, recordset) => {
            if (err) {
                res.status(500).json({
                    msg: 'Could not get colleague requests.'
                });
            } else {
                res.json(recordset);
            }
        });
    });

    app.post('/user/req/colleague', auth, (req, res) => {
        db.insert.colleagueReuqest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                res.status(500).json({
                    msg: 'Could not send colleague request.'
                });
            } else {
                res.status(200).json({
                    msg: 'Request sent to ' + req.body.Username
                });
            }
        });
    });

    app.post('/user/req/employee', auth, (req, res) => {
        //inserts in UserEmployeeRequests
        db.insert.employeeRequest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                res.status(500).json({
                    msg: 'Could not send employee request.'
                });
            } else {
                res.status(200).json({
                    msg: 'Request sent to ' + req.body.Username
                });
            }
        })
    });

    app.post('/user/req/manager', auth, (req, res) => {
        db.insert.managerRequest(req.user.Username, req.body.Username, (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not send manager request.'
                });
            } else {
                res.status(200).json({
                    msg: 'Request sent to ' + req.body.Username
                });
            }
        })
    });

    app.get('/user/req/employee', auth, (req, res) => {
        db.get.userRecievedEmployeeRequests(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not get employee requests'
                });
            } else {
                res.json(recordset);
            }
        });
    });

    app.get('/user/req/manager', auth, (req, res) => {
        db.get.userRecievedManagerRequests(req.user.Username, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not get manager requests'
                });
            } else {
                res.json(recordset);
            }
        });
    });

    app.get('/task/:taskId', auth, (req, res) => {
        db.get.taskById(req.params.taskId, (err, task) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not get task'
                });
            } else {
                db.get.taskAssignedUsersOrderedByUsername(req.params.taskId, (err, recordset) => {
                    let isAssigned = false;
                    for (let i = 0; i < recordset.length; i++) {
                        if (recordset[i].Username === req.user.Username) {
                            isAssigned = true;
                            break;
                        }
                    }

                    task.isOwner = task.Creator_Username === req.user.Username;
                    task.isAssigned = isAssigned;
                    res.status(200).json(task);
                })
            }
        });
    });

    // UPDATE TASK
    app.post('/task/:taskId', auth, (req, res) => {
        db.get.taskById(req.params.taskId, (err, task) => {
            db.get.taskAssignedUsersOrderedByUsername(req.params.taskId, (er, recordset) => {
                let isOwner = req.user.Username === task.Creator_Username;
                let isAssigned = false;
                recordset.forEach(function (element) {
                    if (element.Username === req.user.Username) {
                        isAssigned = true;
                    }
                }, this);
                if (!isOwner && !isAssigned) {
                    res.status(403).json({
                        msg: 'You are not allowed to update this task.'
                    });
                }

                if (req.body.removeAssignment !== undefined) {
                    db.remove.taskAssignment(req.body.removeAssignment, req.params.taskId, (err, recordset) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                msg: 'Could not remove assignment'
                            });
                        } else {
                            res.status(200).json({
                                msg: 'Assignment removed'
                            });
                        }
                    });
                } else {
                    let id = req.params.taskId;
                    let task = {};
                    task.newTitle = (req.query.title !== undefined) ? req.query.title : '';
                    task.newDesc = (req.query.desc !== undefined) ? req.query.desc : '';
                    task.newDeadline = (req.query.deadline !== undefined) ? req.query.deadline.replace('T', ' ') : '';
                    task.newProgress = (req.query.progress !== undefined) ? req.query.progress : '';
                    task.newPriority = (req.query.priority !== undefined) ? req.query.priority : '';
                    task.newRepeatability = (req.query.repeatability !== undefined) ? req.query.repeatability : '';
                    db.update.task(id, task, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                msg: 'Could not update the task.'
                            });
                        } else {
                            res.status(200).json({
                                msg: 'Task Updated.'
                            });
                        }
                    });
                }
            });
        })
    });
}