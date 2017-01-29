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
	INSERT INTO UserColleagueRequests (User_Sent, User_Recieved)
	VALUES (@User_Sent, @User_Recieved);

END
GO
