for %%G in (*.sql) do sqlcmd /S localhost\SQLEXPRESS /d WebTaskManagerDb -U sa -P "123" -i"%%G"
pause
