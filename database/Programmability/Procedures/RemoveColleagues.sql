SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE RemoveColleague
	@User1 NVARCHAR(128),
	@User2 NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @msg NVARCHAR(2048) = FORMATMESSAGE(60000, 500, N'First string', N'second string'); 

	IF EXISTS
		(SELECT * FROM Colleagues WHERE (USER1 = @User1 AND USER2 = @User2) OR (USER1 = @User2 AND USER2 = @User1))
	BEGIN 
		DELETE Colleagues
		WHERE (@User1 = User1 AND @User2 = User2) OR (@User2 = User1 AND @User1 = User2);

		DELETE ManagersEmployees
		WHERE (@User1 = Manager AND @User2 = Employee) OR (@User2 = Manager AND @User1 = Employee);

		DELETE UserColleagueRequests
		WHERE (User_Sent = @User1 AND User_Recieved = @User2)
		OR (User_Sent = @User2 AND User_Recieved = @User1)
	END
	ELSE 
	BEGIN
		DECLARE @DBID INT;
		SET @DBID = DB_ID();

		DECLARE @DBNAME NVARCHAR(128);
		SET @DBNAME = DB_NAME();

		RAISERROR (N'Database ID:%d, Database name is: %s, ERROR: Not Colleagues', 10, 1, @DBID, @DBNAME);
	END
END
GO
