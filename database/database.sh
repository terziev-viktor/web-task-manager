#!/bin/sh
#
# Initializes the database on Ubuntu
#
# Usage:
# cd /path/to/database.sh
# sh database.sh [server] [user] [password]
# example: sh database.sh localhost SA pass123

echo "Deleting Database WebTaskManagerDb if it exists..."
sqlcmd -S $1 -U $2 -P $3 -Q "DROP DATABASE WebTaskManagerDb" 
echo "Creating Database WebTaskManagerDb..."
sqlcmd -S $1 -i `pwd`/Entity\ Framework/Generated\ SQL\ Queries/CreateDatabaseWebTaskManagerDb.sql -U $2 -P $3
find `pwd`/Programmability/ -maxdepth 4 -iname "*.sql" | while read -r f
do
    echo "Processing $f"
    sqlcmd -S $1 -i $f -U $2 -P $3
done
echo "Seeding Database WebTaskManagerDb..."
node `pwd`/SeedUsers.js
sqlcmd -S $1 -i `pwd`/SeedDatabaseWebTaskManager.sql -U $2 -P $3
