USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserAssignedTasks
(	
	@Username NVARCHAR(128)
)
RETURNS TABLE 
AS
RETURN 
(
	SELECT T.* FROM USERS AS U
	JOIN UsersTasks AS UT ON UT.Username = U.Username
	JOIN Tasks AS T ON T.TaskId = UT.TaskId
	WHERE U.Username = @Username
)
GO
