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
RETURNS TABLE 
AS
RETURN 
(
	SELECT ue.Employee FROM UserEmployees AS ue WHERE ue.Username = @Username
)
GO
