
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserEmployees
(	
	@Username NVARCHAR(128),
	@From INT,
	@To INT
)
RETURNS @Employees TABLE 
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX)
)
AS
BEGIN
	DECLARE @EmployeesTmp AS TABLE(Manager NVARCHAR(128))
	DECLARE @Tmp AS TABLE (Username NVARCHAR(128), FullName NVARCHAR(MAX))

	INSERT @EmployeesTmp
	SELECT ue.Employee FROM ManagersEmployees AS ue WHERE ue.Manager = @Username

	INSERT @Tmp(Username, FullName)
	SELECT U.Username, U.FullName FROM @EmployeesTmp AS MT INNER JOIN Users AS U ON U.Username = MT.Manager
	
	IF (@To <> -1)
	BEGIN
		INSERT @Employees
		SELECT TOP (@To) T.Username, T.FullName FROM
		(SELECT ROW_NUMBER() OVER (ORDER BY t.Username) AS rownumber, * FROM @Tmp AS t) AS T
		WHERE rownumber >= @From
	END
	ELSE
	BEGIN
		INSERT @Employees
		SELECT T.Username, T.FullName FROM
		(SELECT ROW_NUMBER() OVER (ORDER BY t.Username) AS rownumber, * FROM @Tmp AS t) AS T
		WHERE rownumber >= @From
	END

	RETURN 
END
GO
