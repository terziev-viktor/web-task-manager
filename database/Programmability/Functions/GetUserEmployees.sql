
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserEmployees
(	
	@Username NVARCHAR(128)
)
RETURNS @Employees TABLE 
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX)
)
AS
BEGIN
	DECLARE @EmployeesTmp AS TABLE(Manager NVARCHAR(128))

	INSERT @EmployeesTmp
	SELECT ue.Employee FROM ManagersEmployees AS ue WHERE ue.Manager = @Username

	INSERT @Employees(Username, FullName)
	SELECT U.Username, U.FullName FROM @EmployeesTmp AS MT INNER JOIN Users AS U ON U.Username = MT.Manager
	RETURN 

END
GO
