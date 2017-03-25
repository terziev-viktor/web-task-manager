module.exports = (db) => {
    const router = require('express').Router();

    // updates progress
    router.post('/:taskId/new-progress', (req, res) => {
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

    // posts new comment to a given task
    router.post('/:taskId/comments', (req, res) => {

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

    // gets all comments from a given task
    router.get('/:taskId/comments', (req, res) => {
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

    // gets all users assigned to a given task
    router.get('/:taskId/assignedUsers', (req, res) => {
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

    // assings user to task, doesn't check for permissions, therefore 
    // permissions check should be done prior to calling the function
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

    // publishes a new task
    router.post('/', (req, res) => {
        let task = req.body;
        if (!task.Title.length > 0) {
            res.status(500).json({
                err: 'Please insert a title for the task.'
            });
        } else if (task.Progress > 100 || task.Progress < 0) {
            res.status(403).json({
                err: 'Please insert progress in range 0 to 100'
            });
        } else {
            task.Creator_Username = req.user.Username;
            task.Deadline = task.Deadline.replace('T', ' ');
            task.Deadline = task.Deadline.replace('Z', '');

            db.insert.task(task, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Server error: Could not create task.'
                    });
                } else {
                    let taskId = recordset[0].TaskId;
                    res.status(200).json({
                        msg: 'Task created'
                    });
                }
            });
        }

    });

    // assignes user to task
    router.post('/assign_user', (req, res) => {
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

    // gets a task by its id
    router.get('/:taskId', (req, res) => {
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
                });
            }
        });
    });

    // updates task
    router.post('/:taskId', (req, res) => {
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
                    return;
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
                    task.newDeadline = '';
                    if(req.query.deadline !== undefined)  {
                        task.newDeadline = req.query.deadline.replace('T', ' ').replace('Z', '');
                    }
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

    return router;
}