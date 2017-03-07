module.exports = (db) => {
    const router = require('express').Router();

    router.get('/', (req, res) => {
        res.json(req.user.Username);
    });

    // Current user becomes employee of user from req.body
    router.post('/employee', (req, res) => {
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
                    res.status(500).json({msg: 'Could not insert employee.'});
                } else {
                    res.status(200).json({
                        msg: 'User inserted to managers'
                    });
                }
            });
        }
    });

    // Current user becomes manager of user from req.body OR removing manager
    router.post('/manager', (req, res) => {
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
                    res.status(500).json({msg: 'Could not insert manager'});
                } else {
                    res.status(200).json('User ' + req.body.Username + ' added to managers.');
                }
            });
        }
    });

    // from = from whitch row, size = how many elements (size = -1 to get all elements)
    router.get('/employees', (req, res) => {
        if (req.query.getCount !== undefined) {
            db.get.userEmployeesCount(req.user.Username, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Count not get employees count.'
                    });
                } else {
                    res.json(recordset[0]);
                }
            });
        } else {
            db.get.userEmployees(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({msg: 'Could not get employees.'});
                } else {
                    res.json(recordset);
                }
            });
        }
    });

    router.get('/employees/:username', (req, res) => {
        db.get.userEmployees(req.params.username, req.query.from, req.query.size, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({msg: 'Could not get employees.'});
            } else {
                res.json(recordset);
            }
        })
    });

    router.get('/managers', (req, res) => {
        if (req.query.getCount !== undefined) {
            db.get.userManagersCount(req.user.Username, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Count not get managers count.'
                    });
                } else {
                    res.json(recordset[0]);
                }
            });
        } else {
            db.get.userManagers(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(401).redirect('/');
                } else {
                    res.json(recordset);
                }
            });
        }
    });

    router.get('/managers/:username', (req, res) => {
        db.get.userManagers(req.params.username, req.query.from, req.query.size, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(401).redirect('/');
            } else {
                res.json(recordset);
            }
        })
    });

    router.post('/colleagues', (req, res) => {
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

    router.get('/colleagues', (req, res) => {
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

    router.get('/req/colleague', (req, res) => {
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

    router.post('/req/colleague', (req, res) => {
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

    router.post('/req/employee', (req, res) => {
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

    router.post('/req/manager', (req, res) => {
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

    router.get('/req/employee', (req, res) => {
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

    router.get('/req/manager', (req, res) => {
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

    return router;
}