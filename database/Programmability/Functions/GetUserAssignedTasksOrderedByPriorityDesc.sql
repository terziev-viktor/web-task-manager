SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserAssignedTasksOrderedByPriorityDesc
(
	@Username NVARCHAR(128)
)
RETURNS 
@AssignedTasks TABLE 
(
	TaskId INT,
    Title NVARCHAR(max),
    [Description] NVARCHAR(max),
    Deadline DATETIME ,
    IsDone BIT ,
    [Priority] INT ,
    Progress INT,
    Repeatability INT,
    Creator_Username NVARCHAR(128)
)
AS
BEGIN
	INSERT @AssignedTasks
	SELECT T.* FROM USERS AS U
	JOIN UsersTasks AS UT ON UT.Username = U.Username
	JOIN Tasks AS T ON T.TaskId = UT.TaskId
	WHERE U.Username = @Username
	ORDER BY T.Priority DESC
	RETURN 
END
GO