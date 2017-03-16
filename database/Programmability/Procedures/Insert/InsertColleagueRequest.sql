
SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertColleagueRequest
	@User_Sent NVARCHAR(128),
	@User_Recieved NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
	IF NOT EXISTS 
	(SELECT * FROM Colleagues WHERE ((User1 = @User_Sent and user2 = @User_Recieved) or (User1 = @User_Recieved and user2 = @User_Sent)))
	BEGIN
		INSERT INTO UserColleagueRequests (User_Sent, User_Recieved)
		VALUES (@User_Sent, @User_Recieved);
	END
	ELSE 
	BEGIN
		RAISERROR (N'Already Colleagues', 10, 1);
	END

END
GO
