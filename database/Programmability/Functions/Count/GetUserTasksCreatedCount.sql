USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION GetUserTasksCreatedCount
(	
	@Creator_Username NVARCHAR(128)
)
RETURNS TABLE 
AS
RETURN
(
	SELECT 
	COUNT(*) AS [Count]
	FROM Tasks AS T
	WHERE T.Creator_Username = @Creator_Username
)
GO