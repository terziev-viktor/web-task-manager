USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION GetUsersByUsernamePart
(	
	@Part NVARCHAR(128)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT U.Username, U.FullName FROM Users AS U WHERE U.Username LIKE '%' + @Part + '%' OR U.FullName LIKE '%' + @Part + '%'
)
GO

