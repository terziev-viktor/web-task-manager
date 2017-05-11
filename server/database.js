const sql = require('mssql'),
    bcrypt = require('bcrypt');
fsys = require('fs');
// database abstraction class
module.exports = class Database {
    constructor(config, saltRounds = 10) {
        this.config = config; // config object
        this.saltRounds = saltRounds; // specific to bcrypt encrypting algorithm

        this.files = {
            delete: (file, cb) => {
                fsys.unlink(__dirname + "/../" + file.Path, (err) => {
                    console.log('fsys unlink error');
                    console.log(err);
                });
                this.request("delete files where Id = " + file.Id, cb);
            },
            insertAvatar: (username, file, cb) => {
                let querystr = "EXEC InsertAvatar N'" +
                    username + "', N'" +
                    file.fieldname + "', N'" +
                    file.originalname + "', N'" +
                    file.encoding + "', N'" +
                    file.mimetype + "', N'" +
                    file.destination + "', N'" +
                    file.filename + "', N'" +
                    file.path + "', " +
                    file.size;

                this.request(querystr, cb);
            },
            insertTaskDesc: (taskId, file, cb) => {
                let querystr = "EXEC InsertFileToTask " + taskId + ", N'" +
                    file.fieldname + "', N'" +
                    file.originalname + "', N'" +
                    file.encoding + "', N'" +
                    file.mimetype + "', N'" +
                    file.destination + "', N'" +
                    file.filename + "', N'" +
                    file.path + "', " +
                    file.size;
                console.log(querystr);
                this.request(querystr, cb);
            },
            getAvatar: (username, cb) => {
                let querystr = "SELECT * FROM GetAvatar(N'" + username + "')";
                this.request(querystr, cb);
            },
            getTaskDesc: (taskid, cb) => {
                let querystr = "SELECT * FROM GetFilesOfTask(" + taskid + ")";
                this.request(querystr, cb);
            },
            getCommentDesc: (id, cb) => {
                let qstr = "SELECT * FROM GetFilesOfComment(" + id + ")";
                this.request(qstr, cb);
            },
            insertCommentDesc: (id, file, cb) => {
                let qstr = "EXEC InsertFileToComment " + id + ", N'" +
                    file.fieldname + "', N'" +
                    file.originalname + "', N'" +
                    file.encoding + "', N'" +
                    file.mimetype + "', N'" +
                    file.destination + "', N'" +
                    file.filename + "', N'" +
                    file.path + "', " +
                    file.size;
                this.request(qstr, cb);
            }
        }

        // insertion queries
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
                let query = "EXEC InsertTask @Title = N'" + task.Title + "', @Description = N'" + task.Description + "', @Deadline = '" + task.Deadline + "', @IsDone='" +
                    task.IsDone + "', @Priority='" + task.Priority + "', @Progress='" + task.Progress + "', @Repeatability='" + task.Repeatability + "', @Creator_Username = N'" +
                    task.Creator_Username + "', @IsArchived='" + task.IsArchived + "';";
                console.log(query);
                this.request(query, cb);
            },
            comment: (content, commentDate, author_username, taskId, cb) => {
                this.request("EXEC InsertComment N'" + content + "', '" + commentDate + "', N'" + author_username + "', '" + taskId + "'", cb);
            },
            managerRequest: (user_sent, user_recieved, cb) => {
                this.request("EXEC InsertManagerRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
            },
            employeeRequest: (user_sent, user_recieved, cb) => {
                this.request("EXEC InsertEmployeeRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
            }
        }

        // deletion queries
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
            },
            employeeRequest: (sent, recieved, cb) => {
                this.request("EXEC RemoveEmployeeRequest N'" + sent + "', N'" + recieved + "'", cb);
            },
            managerRequest: (sent, recieved, cb) => {
                this.request("EXEC RemoveManagerRequest N'" + sent + "', N'" + recieved + "'", cb);
            }
        }

        // assignment queries
        this.assign = {
            usersToTask: (taskId, usersStr, cb) => {
                let query = "EXEC AssignUsersToTask " + taskId + ", N'" + usersStr + "';";
                this.request(query, cb);
            }
        }

        // get queries
        this.get = {
            userRelational: (currentuser, username, cb) => {
                this.request("SELECT * FROM GetUserRelational(N'" + currentuser + "', N'" + username + "')", cb);
            },
            userColleagueRelational: (user, colleagueUsername, cb) => {
                this.request("SELECT * FROM GetUserColleaguesRelational(N'" + user + "', '" + 1 + "', '" + -1 + "') WHERE Username = N'" + colleagueUsername + "'", cb);
            },
            userTasksCreatedCount: (username, cb) => {
                this.request("SELECT * FROM GetUserTasksCreatedCount(N'" + username + "')", cb);
            },
            tasksToDoCount: (username, cb) => {
                this.request("SELECT * FROM GetUserTasksCount(N'" + username + "')", cb);
            },
            userColleagues: (username, from, size, cb) => {
                this.request("SELECT * FROM GetUserColleagues(N'" + username + "', '" + from + "', '" + size + "');", cb);
            },
            userColleaguesRelational: (username, from, size, cb) => {
                this.request("SELECT * FROM GetUserColleaguesRelational(N'" + username + "', '" + from + "', '" + size + "')", cb);
            },
            userColleaguesCount: (username, cb) => {
                this.request("SELECT * FROM GetUserColleaguesCount(N'" + username + "')", cb);
            },
            userColleagueRequests: (username, cb) => {
                this.request("SELECT * FROM GetUserColleagueRequests(N'" + username + "')", cb);
            },
            taskComments: (taskId, cb) => {
                this.request("SELECT * FROM GetTaskComments('" + taskId + "') ORDER BY [Date] DESC", cb);
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
            userEmployeesCount: (username, cb) => {
                this.request("SELECT * FROM GetUserEmployeesCount(N'" + username + "')", cb);
            },
            userManagers: (username, from, size, cb) => {
                this.request("SELECT * FROM GetUserManagers(N'" + username + "', '" + from + "', '" + size + "')", cb);
            },
            userManagersCount: (username, cb) => {
                this.request("SELECT * FROM GetUserManagersCount(N'" + username + "')", cb);
            },
            usersByUsernamePart: (usernamePart, cb) => {
                this.request("SELECT * FROM GetUsersByUsernamePart(N'" + usernamePart + "')", cb);
            },
            userCreatedTasksOrderByPriority: (creatorUsername, from, to, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderedByPriority(N'" + creatorUsername + "', '" + from + "', '" + to + "')", cb);
            },
            userCreatedTasksOrderByPriorityDesc: (creatorUsername, from, size, cb) => {
                this.request("SELECT * FROM GetUserCreatedTasksOrderedByPriorityDesc(N'" + creatorUsername + "', '" + from + "', '" + size + "')", cb);
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
            tasksAssignedToUserOrderedByPriority: (username, from, size, cb) => {
                this.request("SELECT * FROM GetTasksAssignedToUserOrderedByPriority(N'" + username + "', '" + from + "', '" + size + "')", cb);
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

        // update queries
        this.update = {
            password: (username, newpassword, cb) => {
                bcrypt.hash(newpassword, this.saltRounds, (err, hashedPassword) => {
                    if (err) {
                        cb(err);
                    } else {
                        this.request("EXEC UpdatePassword @Username=N'" + username + "', @NewPassword=N'" + hashedPassword + "'", cb);
                    }
                });
            },
            task: (id, task, cb) => {
                let query = "EXEC UpdateTask '" + id +
                    "', N'" + task.newTitle + "', N'" + task.newDesc +
                    "', '" + task.newDeadline +
                    "', '" + task.newPriority + "', '" + task.newProgress +
                    "', '" + task.newRepeatability + "', '" + task.IsArchived + "';";
                this.request(query, cb);
            },
            taskProgress: (id, newProgress, cb) => {
                this.request("EXEC UpdateTaskProgress '" + id + "', '" + newProgress + "';", cb);
            }
        }

        // filtering queries
        this.filter = {
            usersToAssignToTask: (username, filter, taskId, cb) => {
                this.request("SELECT * FROM FilterUsersToAssignToTask(N'" + username + "', N'" + filter + "', '" + taskId + "');", cb);
            },
            colleagues: (username, filter, cb) => {
                this.request("SELECT * FROM FilterColleagues(N'" + username + "', N'" + filter + "')", cb);
            },
            managers: (username, filter, cb) => {
                this.request("SELECT * FROM FilterManagers(N'" + username + "', N'" + filter + "')", cb);
            },
            employees: (username, filter, cb) => {
                this.request("SELECT * FROM FilterEmployees(N'" + username + "', N'" + filter + "')", cb);
            },
            tasksTodo: (username, filter, cb) => {
                this.request("SELECT * FROM FilterTasksAssignedToUser(N'" + username + "', N'" + filter + "')", cb);
            },
            tasksCreated: (username, filter, cb) => {
                this.request("SELECT * FROM FilterTasksCreated(N'" + username + "', N'" + filter + "')", cb);
            }
        }

        this.logins = {
            find: (cookieId, cb) => {
                this.request("SELECT * FROM Logins WHERE LoginId=N'" + cookieId + "'", cb);
            },
            delete: (cookieId, cb) => {
                this.request("DELETE Logins WHERE LoginId=N'" + cookieId + "'", cb);
            },
            insert: (cookieId, username, fullname, cb) => {
                this.request("INSERT Logins([LoginId], [Username], [FullName]) VALUES(N'" + cookieId + "', N'" + username + "', N'" + fullname + "')", cb);
            }
        }
    }

    // executes queries in the database, passes results to callback
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