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
RETURNS TABLE 
AS
RETURN 
(
	SELECT um.Manager FROM ManagersEmployees AS um WHERE um.Employee = @Username
)
GO
