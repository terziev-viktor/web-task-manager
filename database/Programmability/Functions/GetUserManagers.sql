USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserManagers
(	
	@Username NVARCHAR(128)
)
RETURNS @Managers TABLE 
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX)
)
AS
BEGIN 
	DECLARE @ManagersTmp AS TABLE(Manager NVARCHAR(128))
	INSERT @ManagersTmp
	SELECT um.Manager FROM ManagersEmployees AS um WHERE um.Employee = @Username

	INSERT @Managers(Username, FullName)
	SELECT U.Username, U.FullName FROM @ManagersTmp AS MT INNER JOIN Users AS U ON U.Username = MT.Manager
	RETURN 
END
GO

