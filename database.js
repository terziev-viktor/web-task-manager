const sql = require('mssql'),
    bcrypt = require('bcrypt');

module.exports = class Database {
    constructor(config, saltRounds = 10) {
        this.config = config;
        this.saltRounds = saltRounds;
        this.insert = {
            user: (user, cb) => {
                let {
                    username,
                    fullname,
                    password
                } = user;
                bcrypt.hash(password, this.saltRounds, (err, hashedPassword) => {
                    if (err) {
                        cb(err);
                    } else {
                        this.request("EXEC InsertUser @Username=N'" + username + "', @FullName=N'" + fullname + "', @Password=N'" + hashedPassword + "'", cb);
                    }
                });
            },
            colleagues: (user1, user2, cb) => {
                this.request("EXEC InsertColleagues N'" + user1 + "', N'" + user2 + "';", cb);
            },
            userManager: (username, manager, cb) => {
                this.request("EXEC InsertUserManager N'" + username + "', N'" + manager + "'", cb);
            },
            colleagueReuqest: (user_sent, user_recieved, cb) => {
                this.request("EXEC InsertColleagueRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
            },
            task: (task, cb) => {
                this.request("EXEC InsertTask @Title = N'" + task.Title + "', @Description = N'" + task.Description + "', @Deadline = '" + task.Deadline + "', @IsDone='" +
                    task.IsDone + "', @Priority='" + task.Priority + "', @Progress='" + task.Progress + "', @Repeatability='" + task.Repeatability + "', @Creator_Username = N'" +
                    task.Creator_Username + "';", cb);
            },
            comment: (content, author_username, taskId, cb) => {
                this.request("EXEC InsertComment @Content = N'" + content + "', @Author_Username = N'" + author_username + "', @Task_TaskId='" + taskId + "'", cb);
            },
            managerRequest: (user_sent, user_recieved, cb) => {
                this.request("EXEC InsertManagerRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
            },
            employeeRequest: (user_sent, user_recieved, cb) => {
                this.request("EXEC InsertEmployeeRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
            }
        }

        this.remove = {
            colleague: (user1, user2, cb) => {
                this.request("EXEC RemoveColleague N'" + user1 + "', N'" + user2 + "';", cb);
            },
            userManager: (user, manager, cb) => {
                this.request("EXEC RemoveUserManager N'" + user + "', N'" + manager + "';", cb);
            },
            userEmployee: (user, employee, cb) => {
                this.request("EXEC RemoveUserEmployee N'" + user + "', N'" + employee + "';", cb);
            },
            taskAssignment: (username, taskid, cb) => {
                this.request("EXEC RemoveTaskAssignment N'" + username + "', '" + taskid + "';", cb);
            }
        }

        this.assign = {
            usersToTask: (taskId, usersStr, cb) => {
                let query = "EXEC AssignUsersToTask " + taskId + ", N'" + usersStr + "';";
                this.request(query, cb);
            }
        }

        this.get = {
            userTasksCreatedCount: (username, cb) => {
                this.request("SELECT * FROM GetUserTasksCreatedCount(N'" + username + "')", cb);
            },
            tasksToDoCount: (username, cb) => {
                this.request("SELECT * FROM GetUserTasksCount(N'" + username + "')", cb);
            },
            userColleagues: (username, from , size, cb) => {
                this.request("SELECT * FROM GetUserColleagues(N'" + username + "', '" + from + "', '" + size + "');", cb);
            },
            userColleaguesCount: (username, cb) => {
                this.request("SELECT * FROM GetUserColleaguesCount(N'" + username + "')", cb);
            },
            userColleagueRequests: (username, cb) => {
                this.request("SELECT * FROM GetUserColleagueRequests(N'" + username + "')", cb);
            },
            taskComments: (taskId, cb) => {
                this.request("SELECT * FROM GetTaskComments('" + taskId + "')", cb);
            },
            userByUsername: (username, cb) => {
                this.request("SELECT * FROM GetUserByUsername(N'" + username + "')", (err, recordset) => {
                    if (recordset) {
                        cb(err, recordset[0]);
                    } else {
                        cb(err);
                    }
                });
            },
            userEmployees: (username, from, size, cb) => {
                this.request("SELECT * FROM GetUserEmployees(N'" + username + "', '" + from + "', '" + size + "')", cb);
            },
            userManagers: (username, cb) => {
                this.request("SELECT * FROM GetUserManagers(N'" + username + "')", cb);
            },
            usersByUsernamePart: (usernamePart, cb) => {
                this.request("SELECT * FROM GetUsersByUsernamePart(N'" + usernamePart + "')", cb);
            },
            userCreatedTasksOrderByPriority: (creatorUsername, from, to, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderedByPriority(N'" + creatorUsername + "', '" + from + "', '" + to + "')", cb);
            },
            userCreatedTasksOrderByPriorityDesc: (creatorUsername, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderByPriorityDesc(N'" + creatorUsername + "')", cb);
            },
            userCreatedTasksOrderByTitle: (creatorUsername, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderByTitle(N'" + creatorUsername + "')", cb);
            },
            userCreatedTasksOrderByTitleDesc: (creatorUsername, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderByTitleDesc(N'" + creatorUsername + "')", cb);
            },
            userCreatedTasksOrderByDeadline: (creatorUsername, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderByDeadline(N'" + creatorUsername + "')", cb);
            },
            userCreatedTasksOrderByDeadlineDesc: (creatorUsername, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderByDeadlineDesc(N'" + creatorUsername + "')", cb);
            },
            tasksAssignedToUserOrderedByPriority: (username, from, to, cb) => {
                this.request("SELECT * FROM GetTasksAssignedToUserOrderedByPriority(N'" + username + "', '" + from + "', '" + to + "')", cb);
            },
            tasksAssignedToUserOrderedByPriorityDesc: (username, cb) => {
                this.request("SELECT * FROM GetTasksAssignedToUserOrderedByPriorityDesc(N'" + username + "')", cb);
            },
            userRecievedEmployeeRequests: (username, cb) => {
                this.request("SELECT * FROM GetUserRecievedEmployeeRequests(N'" + username + "');", cb);
            },
            userRecievedManagerRequests: (username, cb) => {
                this.request("SELECT * FROM GetUserRecievedManagerRequests(N'" + username + "');", cb);
            },
            taskById: (id, cb) => {
                this.request("SELECT * FROM GetTaskById('" + id + "');", (err, recordset) => {
                    if (err) {
                        cb(err)
                    } else {
                        if (recordset) {
                            cb(err, recordset[0]);
                        }
                    }
                });
            },
            taskAssignedUsersOrderedByUsername: (taskId, cb) => {
                this.request("SELECT * FROM GetTaskAssignedUsersOrderedByUsername('" + taskId + "');", cb);
            }
        }

        this.update = {
            task: (id, task, cb) => {
                let query = "EXEC UpdateTask '" + id +
                    "', N'" + task.newTitle + "', N'" + task.newDesc +
                    "', '" + task.newDeadline +
                    "', '" + task.newPriority + "', '" + task.newProgress +
                    "', '" + task.newRepeatability + "';";
                console.log(query);
                this.request(query, cb);
            },
            taskProgress: (id, newProgress, cb) => {
                this.request("EXEC UpdateTaskProgress '" + id + "', '" + newProgress + "';", cb);
            }
        }
    }

    request(query, cb) {

        let conn = new sql.Connection(this.config);
        let req = new sql.Request(conn);

        conn.connect((err) => {
            if (err) {
                console.log(err)
                cb(err);
            }

            req.query(query, (err, recordset) => {
                conn.close();
                cb(err, recordset)
            });
        });
    }
}