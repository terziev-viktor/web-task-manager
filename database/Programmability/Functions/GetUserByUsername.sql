USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION GetUserByUsername
(	
	@Username NVARCHAR(128)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT TOP 1 U.Username, U.FullName, U.[Password] FROM Users AS U WHERE U.Username = @Username
)
GO
