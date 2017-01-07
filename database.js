const sql = require('mssql');



module.exports = class Database {
    constructor (config) {
        this.config = config
    }

    request(query, cb) {
        let conn = new sql.Connection(this.config)
        let req = new sql.Request(conn)
    
        conn.connect((err) => {
            if(err) {
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
        let {username, password} = user
        request("exec insertUser @Username=" + username + " @Password=" + password, cb)
    }

    
}

// user: "sa"
// password "123456"
// server: localhost\\SQLEXPRESS01