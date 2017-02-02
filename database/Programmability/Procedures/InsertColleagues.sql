SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertColleagues
	@User1 NVARCHAR(128),
	@User2 NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @msg NVARCHAR(2048) = FORMATMESSAGE(60000, 500, N'First string', N'second string'); 

	if NOT EXISTS 
		(SELECT * FROM Colleagues WHERE (USER1 = @User1 AND USER2 = @User2) OR (USER1 = @User2 AND USER2 = @User1))
	BEGIN 
		INSERT INTO Colleagues (User1, User2)
		VALUES (@User1, @User2);

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

		RAISERROR (N'Database ID:%d, Database name is: %s, ERROR: Already Colleagues', 10, 1, @DBID, @DBNAME);
	END
END
GO
