for %%G in (*.sql) do sqlcmd /S localhost\SQLEXPRESS01 /d WebTaskManagerDb -U sa -P "123456" -i"%%G"
pause
