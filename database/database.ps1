# Description:
# Initializes the database on Windows
#
# Usage:
# cd \path\to\database.sh
# powershell -File database.ps1 [server] [user] [password] [delete database parameter]
# example: powershell -File database.ps1 localhost SA pass123   #  will NOT delete the database prior to running the init scripts
# example: powershell -File database.ps1 localhost SA pass123 deldb   # will delete the database prior to running the init scripts
# 


$server=$args[0]
$user=$args[1]
$pass=$args[2]

if($args[3] -eq "deldb"){
    echo "Deleting Database WebTaskManagerDb if it exists..."
    sqlcmd -S $server -U $user -P $pass -Q "DROP DATABASE WebTaskManagerDb" 
}


echo "Creating Database WebTaskManagerDb..."
sqlcmd -S $server -i (Join-Path $pwd "\Entity Framework\Generated SQL Queries\CreateDatabaseWebTaskManagerDb.sql") -U $user -P $pass

foreach ($item in Get-ChildItem -Recurse -File (Join-Path $pwd \Programmability\) | Select-Object FullName)
{
    $file=$item.FullName
    echo "Processing $file"
    sqlcmd -S $server -i $file -U $user -P $pass
}

echo "Seeding Database WebTaskManagerDb..."
node (Join-Path $pwd \SeedUsers.js)
sqlcmd -S $server -i (Join-Path $pwd \SeedDatabase.sql) -U $user -P $pass
