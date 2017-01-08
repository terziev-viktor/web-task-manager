
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserCreatedTasksOrderByDeadlineDesc
(
	@Creator_Username NVARCHAR(128)
)
RETURNS 
@CreatorTasks TABLE 
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
	INSERT @CreatorTasks
	SELECT 
	T.TaskId, 
	T.Title, 
	T.[Description], 
	T.Deadline, 
	T.IsDone, 
	T.[Priority], 
	T.Progress, 
	T.Repeatability, 
	T.Creator_Username 
	FROM Tasks AS T
	WHERE T.Creator_Username = @Creator_Username
	ORDER BY T.[Deadline] DESC
	RETURN 
END
GO