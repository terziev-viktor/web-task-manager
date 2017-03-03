module.exports = (db) => {
    const router = require('express').Router();

    router.get('/todo', (req, res) => {
        if (req.query.getCount !== undefined) {
            db.get.tasksToDoCount(req.user.Username, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({msg: "Could not get user's to-do list size"});
                } else {
                    let data = recordset[0];
                    res.status(200).json(data);
                }
            });
        } else {
            db.get.tasksAssignedToUserOrderedByPriority(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({msg: "Could not get user's to-do list"});
                } else {
                    let data = {
                        tasks: recordset
                    };
                    res.json(data);
                }

            });
        }
    });

    router.get('/todo/:username', (req, res) => {
        db.get.tasksAssignedToUserOrderedByPriority(req.params.username, req.query.from, req.query.size, (err, recordset) => {
            if (err) {
                console.log(err)
                res.status(500).json({msg: 'Could not get ' + req.params.username + ' to-do list'});
            } else {
                let data = {
                    tasks: recordset
                };
                console.log(data);
                res.json(data);
            }

        });
    });

     router.get('/created', (req, res) => {
        if (req.query.getCount !== undefined) {
            db.get.userTasksCreatedCount(req.user.Username, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({msg: 'Could not get created tasks count.'});
                } else {
                    let data = recordset[0];
                    res.json(data);
                }
            });
        } else {
            db.get.userCreatedTasksOrderByPriority(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({msg: 'Could not get created tasks.'});
                } else {
                    let data = {
                        tasks: recordset
                    };

                    res.status(200).json(data);
                }

            });
        }
    });

    router.get('/created/:username', (req, res) => {
        db.get.userCreatedTasksOrderByPriority(req.params.username, req.query.from, req.query.size, (err, recordset) => {
            if (err) {
                console.log(err)
                res.status(500).json({msg: "Could not get " + req.params.username + "'s created tasks."});
            } else {
                let data = {
                    tasks: recordset
                };
                
                res.json(data);
            }

        });
    });

    return router;
}

 