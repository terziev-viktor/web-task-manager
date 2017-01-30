#!/bin/sh

# Usage:
# cd /path/to/database.sh
# sh database.sh [server] [user] [password]
# example: sh database.sh localhost SA pass123

echo "Deleting Database WebTaskManagerDb if it exists..."
sqlcmd -S $1 -U $2 -P $3 -Q "DROP DATABASE WebTaskManagerDb" 
echo "Creating Database WebTaskManagerDb..."
sqlcmd -S $1 -i `pwd`/Entity\ Framework/Generated\ SQL\ Queries/CreateDatabaseWebTaskManagerDb.sql -U $2 -P $3
FUNC=`pwd`/Programmability/Functions/*.sql
PROC=`pwd`/Programmability/Procedures/*.sql
for f in $FUNC $PROC
do
    echo "Processing $f"
    sqlcmd -S $1 -i $f -U $2 -P $3
done
echo "Seeding Database WebTaskManagerDb..."
sqlcmd -S $1 -i `pwd`/SeedDatabaseWebTaskManager.sql -U $2 -P $3
