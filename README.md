# web-task-manager

## Description
A web application designed to manage an institution's tasks for all of it's employees and/or managers.

## Installation

### Clone the repository from github
```
git clone https://github.com/terziev-viktor/web-task-manager.git
cd web-task-manager
```

### Install `npm` and `bower` deps
```
npm install && bower install
```

### Setup Microsoft SQL Server Express
Create `server/database_config.json`. It should look like:
```json
{
    "server": "localhost",
    "database": "WebTaskManagerDb",
    "user": "SA",
    "password": "SuperSecretPass",
    "port": 1433,
    "option": {
        "encrypt": true
    }
}
```

#### Windows 

##### First Method:
Execute `database\database.ps1`. Usage of the powershell script:
```
# cd database
# powershell -File database.ps1 [server] [user] [password]
# example: powershell -File database.ps1 localhost SA pass123
```

If you want to delete the database prior to running the init scripts, specify `deldb` as the last parameter. Example:
```
powershell -File database.ps1 localhost SA pass123 deldb
```

##### Second Method:
Use [Microsoft SQL Server Management Studio (MSSMS)](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) to run `database\Entity Framework\Generated SQL Queries\CreateDatabaseWebTaskManagerDb.sql`, all sql files from `database\Programmability`, use `node` to execute `database/SeedUsers.js`, run `database/SeedDatabaseWebTaskManager.sql` with MSSMS.

#### Ubuntu
[Microsoft SQL Server port for Ubuntu](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-ubuntu) is used. To setup the database execute `database/database.sh`. Usage of the sh script:
```
# cd database
# sh database.sh [server] [user] [password]
# example: sh database.sh localhost SA pass123
```

## Start the express.js server
```
npm start
```
