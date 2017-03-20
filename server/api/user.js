module.exports = (db) => {
    const router = require('express').Router(),
        bcrypt = require('bcrypt');

    router.get('/', (req, res) => {
        res.json(req.user.Username);
    });

    router.post('/newpass', (req, res) => {
        let oldpass = req.body.oldpass,
            newpass = req.body.newpass,
            confirm = req.body.confirm;
        if (!oldpass || !newpass || !confirm) {
            res.status(400).json('Bad request body');
            return;
        } else if (newpass !== confirm) {
            res.status(409).json({
                msg: 'New password and confirm password do not match.'
            });
            return;
        }
        if (newpass.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!#$%?\-\_+=&*@><]{8,}$/g) === null) {
            res.status(409).json({
                msg: "Password must contain minimum 8 characters at least 1 Alphabet, 1 Number and 1 Special Character",
                errCode: 1
            });
            return;
        }

        db.get.userByUsername(req.user.Username, (err, user) => {
            if (err) {
                res.status(500).json({
                    msg: 'Server error...'
                });
                return;
            }
            // compare old password with current passoword -> result = true|false
            bcrypt.compare(oldpass, user.Password, (er, result) => {
                if (er) {
                    res.status(500).json({
                        msg: 'Server error...'
                    });
                } else if (!result) {
                    res.status(400).json({
                        msg: 'Old password is incorrect.'
                    });
                } else {
                    db.update.password(req.user.Username, newpass, (err, recordset) => {
                        if (err) {
                            res.status(500).json({
                                msg: 'Could not update password'
                            });
                        } else {
                            res.status(200).json({
                                msg: 'Password updated'
                            });
                        }
                    });
                }
            });
        });
    });

    // current user becomes employee of user from req.body
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
                    res.status(500).json({
                        msg: 'Could not insert employee.'
                    });
                } else {
                    res.status(200).json({
                        msg: 'User inserted to managers'
                    });
                }
            });
        }
    });

    // current user becomes manager of user from req.body OR removing manager
    router.post('/manager', (req, res) => {
        if (req.query.remove === true) {
            let managerToRemove = req.body.Username;
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
                    res.status(500).json({
                        msg: 'Could not insert manager'
                    });
                } else {
                    res.status(200).json('User ' + req.body.Username + ' added to managers.');
                }
            });
        }
    });

    // get employees of authenticated user
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
                    res.status(500).json({
                        msg: 'Could not get employees.'
                    });
                } else {
                    res.json(recordset);
                }
            });
        }
    });

    //get employees of a given user
    router.get('/employees/:username', (req, res) => {
        db.get.userEmployees(req.params.username, req.query.from, req.query.size, (err, recordset) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    msg: 'Could not get employees.'
                });
            } else {
                res.json(recordset);
            }
        })
    });

    // get managers of authenticated user
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

    // get managers of a given user
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

    // manipulates colleague connections
    router.post('/colleagues', (req, res) => {
        if (req.query.remove === 'true') {
            // if the quety parameter remove is set to true then the connection is removed
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
            // if the query parameter is set to false or doesn't exist then the 
            // authenticated user and user specified in the body become colleagues
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

    // gets colleagues of the authenticated user
    // if the query parameter 'getCount' is not undefined,
    // then the request returns the number of colleagues,
    // if the query parameter 'relational' is not undefined
    // the request returns table with user colleagues and relations
    router.get('/colleagues', (req, res) => {
        if (req.query.relational !== undefined) {
            db.get.userColleaguesRelational(req.user.Username, req.query.from, req.query.size, (err, recordset) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Could not retrieve user colleagues'
                    });
                }
            });
        } else if (req.query.getCount !== undefined) {
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

    // gets the colleague requests of the authenticated user
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

    // sends colleague request to the user from req.body
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

    // sends employee request to the user from req.body
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

    // sends manager request to the user from req.body
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

    // gets the employee requests of the authenticated user
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

    // gets the manager requests of the authenticated user
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