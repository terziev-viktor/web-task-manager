SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertUserManager
	@Username NVARCHAR(128),
	@Manager NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO ManagersEmployees ([Manager], [Employee])
	VALUES (@Manager, @Username);

	DELETE UserManagerRequests
	WHERE (User_Sent = @Username AND User_Recieved = @Manager)
	OR (User_Sent = @Manager AND User_Recieved = @Username)

	DELETE UserEmployeeRequests
	WHERE (User_Sent = @Username AND User_Recieved = @Manager)
	OR (User_Sent = @Manager AND User_Recieved = @Username)
END
GO
