for %%G in (*.sql) do sqlcmd /S localhost\SQLEXPRESS /d WebTaskManagerDb -U <your username here> -P "<your password here>" -i"%%G"
pause
