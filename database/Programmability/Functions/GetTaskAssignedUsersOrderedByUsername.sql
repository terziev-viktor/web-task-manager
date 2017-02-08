USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetTaskAssignedUsersOrderedByUsername
(	
	@TaskId NVARCHAR(128)
)
RETURNS 
@Assigned TABLE 
(
	Username NVARCHAR(128)
)
AS
BEGIN
	INSERT @Assigned
	SELECT UT.Username FROM dbo.UsersTasks AS UT WHERE UT.TaskId = @TaskId
	ORDER BY UT.Username

	RETURN
END
GO
