const sql = require('mssql');

module.exports = class Database {
    constructor(config) {
        this.config = config;
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
        this.request("EXEC InsertUser @Username=" + username + ", @Password=" + password, cb);

    }

    // Property Username of user object is it's ID in the database
    getUserByUsername(username, cb) {
        this.request("SELECT * FROM GetUserByUsername('" + username + "')", (err, recordset) => {
            cb(err, recordset[0]);
        });
    }

    // Returns all users with username containing requested string (usernamePart)
    getUsersByUsernamePart(usernamePart, cb) {
        this.request("SELECT * FROM GetUsersByUsernamePart('" + usernamePart + "')", cb)
    }

    getUserCreatedTasksOrderByPriority(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByPriority('" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByPriorityDesc(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByPriorityDesc('" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByTitle(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByTitle('" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByTitleDesc(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByTitleDesc('" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByDeadline(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByDeadline('" + creatorUsername + "')", cb)
    }

    getUserCreatedTasksOrderByDeadlineDesc(creatorUsername, cb) {
        this.request("SELECT * FROM GetUserCreatedTasksOrderByDeadlineDesc('" + creatorUsername + "')", cb)
    }

    getTasksAssignedToUserOrderedByPriority(username, cb) {
        this.request("SELECT * FROM GetTasksAssignedToUserOrderedByPriority('" + username + "')", cb)
    }

    getTasksAssignedToUserOrderedByPriorityDesc(username, cb) {
        this.request("SELECT * FROM GetTasksAssignedToUserOrderedByPriorityDesc('" + username + "')", cb)
    }
}

