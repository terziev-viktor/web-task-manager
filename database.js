const sql = require('mssql'),
    bcrypt = require('bcrypt');

module.exports = class Database {
    constructor(config, saltRounds = 10) {
        this.config = config;
        this.saltRounds = saltRounds;
    }

    request(query, cb) {

        let conn = new sql.Connection(this.config)
        let req = new sql.Request(conn)

        conn.connect((err) => {
            if (err) {
                console.log(err)
                cb(err);
            }

            req.query(query, (err, recordset) => {
                conn.close();
                cb(err, recordset)
            })
        })
    }

    insertUser(user, cb) {
        let {username, password} = user;
        bcrypt.hash(password, this.saltRounds, (err, hashedPassword) => {
            if (err) {
                cb(err);
            } else {
                this.request("EXEC InsertUser @Username=N'" + username + "', @Password=N'" + hashedPassword + "'", cb);
            }
        });
    }

    insertColleagues(user1, user2, cb) {
        this.request("EXEC InsertColleagues N'" + user1 + "', N'" + user2 + "';", cb);
    }

    removeColleague(user1, user2, cb) {
        this.request("EXEC RemoveColleague N'" + user1 + "', N'" + user2 + "';", cb);
    }

    removeUserManager(user, manager, cb) {
        this.request("EXEC RemoveUserManager N'" + user + "', N'" + manager + "';", cb);
    }

    removeUserEmployee(user, employee, cb) {
        this.request("EXEC RemoveUserEmployee N'" + user + "', N'" + employee + "';", cb);
    }

    removeTaskAssignment(username, taskid, cb) {
        this.request("EXEC RemoveTaskAssignment N'" + username + "', '" + taskid + "';", cb);
    }

    insertColleagueReuqest(user_sent, user_recieved, cb) {
        this.request("EXEC InsertColleagueRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
    }

    insertTask(task, cb) {
        this.request("EXEC InsertTask @Title = N'" + task.Title + "', @Description = N'" + task.Description + "', @Deadline = '" + task.Deadline + "', @IsDone='" +
            task.IsDone + "', @Priority='" + task.Priority + "', @Progress='" + task.Progress + "', @Repeatability='" + task.Repeatability + "', @Creator_Username = N'" +
            task.Creator_Username + "';", cb);
    }

    insertUserManager(username, manager, cb) {
        this.request("EXEC InsertUserManager N'" + username + "', N'" + manager + "'", cb);
    }

    assignUsersToTask(taskId, usersStr, cb) {
        let query = "EXEC AssignUsersToTask " + taskId + ", N'" + usersStr + "';";
        this.request(query, cb);
    }

    insertComment(content, author_username, taskId, cb) {
        this.request("EXEC InsertComment @Content = N'" + content + "', @Author_Username = N'" + author_username + "', @Task_TaskId='" + taskId + "'", cb);
    }

    getUserColleagues(username, cb) {
        this.request("SELECT * FROM GetUserColleagues(N'" + username + "');", cb);
    }

    getUserColleagueRequests(username, cb) {
        this.request("SELECT * FROM GetUserColleagueRequests(N'" + username + "')", cb);
    }

    getTaskComments(taskId, cb) {
        this.request("SELECT * FROM GetTaskComments('" + taskId + "')", cb);
    }

    // Property Username of user object is it's ID in the database
    getUserByUsername(username, cb) {
        this.request("SELECT * FROM GetUserByUsername(N'" + username + "')", (err, recordset) => {
            if (recordset) {
                cb(err, recordset[0]);
            } else {
                cb(err);
            }
        });
    }

    getUserEmployees(username, cb) {
        this.request("SELECT * FROM GetUserEmployees(N'" + username + "')", cb);
    }

    getUserManagers(username, cb) {
        this.request("SELECT * FROM GetUserManagers(N'" + username + "')", cb);
    }

    // Returns all users with username containing requested string (usernamePart)
    getUsersByUsernamePart(usernamePart, cb) {
        this.request("SELECT * FROM GetUsersByUsernamePart(N'" + usernamePart + "')", cb)
    }

    getUserCreatedTasksOrderByPriority(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByPriority(N'" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByPriorityDesc(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByPriorityDesc(N'" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByTitle(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByTitle(N'" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByTitleDesc(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByTitleDesc(N'" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByDeadline(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByDeadline(N'" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByDeadlineDesc(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByDeadlineDesc(N'" + creatorUsername + "')", cb)
    }

    getTasksAssignedToUserOrderedByPriority(username, cb) {
        this.request("SELECT * FROM GetTasksAssignedToUserOrderedByPriority(N'" + username + "')", cb)
    }

    getTasksAssignedToUserOrderedByPriorityDesc(username, cb) {
        this.request("SELECT * FROM GetTasksAssignedToUserOrderedByPriorityDesc(N'" + username + "')", cb)
    }

    getUserRecievedEmployeeRequests(username, cb) {
        this.request("SELECT * FROM GetUserRecievedEmployeeRequests(N'" + username + "');", cb);
    }

    getUserRecievedManagerRequests(username, cb) {
        this.request("SELECT * FROM GetUserRecievedManagerRequests(N'" + username + "');", cb);
    }

    insertManagerRequest(user_sent, user_recieved, cb) {
        this.request("EXEC InsertManagerRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
    }

    insertEmployeeRequest(user_sent, user_recieved, cb) {
        this.request("EXEC InsertEmployeeRequest N'" + user_sent + "', N'" + user_recieved + "';", cb);
    }
    
    updateTask(id, task, cb) {
        let query = "EXEC UpdateTask '" + id
            + "', N'" + task.newTitle + "', N'" + task.newDesc
            + "', '" + task.newDeadline
            + "', '" + task.newPriority + "', '" + task.newProgress
            + "', '" + task.newRepeatability + "';";
        console.log(query);
        this.request(query, cb);
    }

    updateTaskProgress(id, newProgress, cb) {
        this.request("EXEC UpdateTaskProgress '" + id + "', '" + newProgress + "';", cb);
    }

    getTaskById(id, cb) {
        this.request("SELECT * FROM GetTaskById('" + id + "');", (err, recordset) => {
            if (err) {
                cb(err)
            } else {
                if (recordset) {
                    cb(err, recordset[0]);
                }
            }
        });
    }

    getTaskAssignedUsersOrderedByUsername(taskId, cb) {
        this.request("SELECT * FROM GetTaskAssignedUsersOrderedByUsername('" + taskId + "');", cb);
    }
}

