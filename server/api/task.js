module.exports = (db) => {
    const router = require('express').Router(),
        xss = require('xss');

    // posts new comment to a given task
    router.post('/:taskId/comments', (req, res) => {
        let commentDate = req.body.date.replace('T', ' ');
        commentDate = commentDate.replace('Z', '');

        db.insert.comment(req.body.content, commentDate, req.user.Username, req.params.taskId, (err, recordset) => {
            if (err || !recordset) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not post the comment.'
                });
            } else {
                console.log(recordset);
                res.status(200).json({
                    msg: 'Comment posted.',
                    id: recordset[0].Id
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
        if (task.Title.length <= 0 || task.Title.length >= 41 || task.Title.includes('\n')) {
            res.status(403).json({
                msg: 'Task title must be in range 1 - 40 and cannot include new lines',
                errCode: 3
            });
        } else if (task.Progress > 100 || task.Progress < 0) {
            res.status(403).json({
                msg: 'Please insert progress in range 0 to 100',
                errCode: 4
            });
        } else if (task.Description.length > 5000) {
            res.status(403).json({
                msg: 'Description max length is 5000 characters',
                errCode: 5
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

    // assigns user to task
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
                    task.newTitle = (req.body.title !== undefined) ? req.body.title : '';
                    task.newDesc = (req.body.desc !== undefined) ? req.body.desc : '';
                    task.newDeadline = '';
                    if (req.body.deadline !== undefined) {
                        task.newDeadline = req.body.deadline.replace('T', ' ').replace('Z', '');
                    }
                    task.newProgress = (req.body.progress !== undefined) ? req.body.progress : '';
                    task.newPriority = (req.body.priority !== undefined) ? req.body.priority : '';
                    task.newRepeatability = (req.body.repeatability !== undefined) ? req.body.repeatability : '';
                    task.IsArchived = (req.body.isArchived !== undefined) ? req.body.isArchived: '';
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