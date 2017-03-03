USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserManagers
(	
	@Username NVARCHAR(128),
	@From INT,
	@Size INT
)
RETURNS @Managers TABLE 
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX)
)
AS
BEGIN 
	DECLARE @ManagersTmp AS TABLE(Manager NVARCHAR(128))
	DECLARE @ResultTmp AS TABLE (Username NVARCHAR(128), FullName NVARCHAR(MAX))

	INSERT @ManagersTmp
	SELECT um.Manager FROM ManagersEmployees AS um WHERE um.Employee = @Username

	INSERT @ResultTmp(Username, FullName)
	SELECT U.Username, U.FullName FROM @ManagersTmp AS MT INNER JOIN Users AS U ON U.Username = MT.Manager

	IF (@Size <> -1)
	BEGIN
		INSERT @Managers
		SELECT TOP (@Size) T.Username, T.FullName FROM
		(SELECT ROW_NUMBER() OVER (ORDER BY t.Username) AS rownumber, * FROM @ResultTmp AS t) AS T
		WHERE rownumber >= @From
	END
	ELSE
	BEGIN
		INSERT @Managers
		SELECT T.Username, T.FullName FROM
		(SELECT ROW_NUMBER() OVER (ORDER BY t.Username) AS rownumber, * FROM @ResultTmp AS t) AS T
		WHERE rownumber >= @From
	END
	RETURN 
END
GO

