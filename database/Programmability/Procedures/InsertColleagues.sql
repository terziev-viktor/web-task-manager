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
	INSERT INTO Colleagues (User1, User2)
	VALUES (@User1, @User2);

	DELETE UserColleagueRequests
	WHERE (User_Sent = @User1 AND User_Recieved = @User2)
	OR (User_Sent = @User2 AND User_Recieved = @User1)
END
GO
