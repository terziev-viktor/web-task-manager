USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetTasksAssignedToUserOrderedByPriority
(
	@Username NVARCHAR(128),
	@From INT,
	@To INT
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
	DECLARE @Tmp AS TABLE (TaskId INT,
    Title NVARCHAR(max),
    [Description] NVARCHAR(max),
    Deadline DATETIME ,
    IsDone BIT ,
    [Priority] INT ,
    Progress INT,
    Repeatability INT,
    Creator_Username NVARCHAR(128))

	INSERT @Tmp
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
	INNER JOIN userstasks as ut ON ut.taskid = t.taskid
	INNER JOIN users as u ON u.username = ut.username
	where u.Username = @Username
	ORDER BY T.[Priority]

	IF (@To <> -1)
	BEGIN
	INSERT @AssignedTasks
		SELECT TOP (@To) T.TaskId, 
		T.Title, 
		T.[Description], 
		T.Deadline, 
		T.IsDone, 
		T.[Priority], 
		T.Progress, 
		T.Repeatability, 
		T.Creator_Username FROM
		(SELECT ROW_NUMBER() OVER (ORDER BY PRIORITY) AS rownumber, * FROM @Tmp AS t) AS T
		WHERE rownumber >= @From
	END
	ELSE
	BEGIN
		INSERT @AssignedTasks
		SELECT T.TaskId, 
		T.Title, 
		T.[Description], 
		T.Deadline, 
		T.IsDone, 
		T.[Priority], 
		T.Progress, 
		T.Repeatability, 
		T.Creator_Username FROM
		(SELECT ROW_NUMBER() OVER (ORDER BY PRIORITY) AS rownumber, * FROM @Tmp AS t) AS T
	WHERE rownumber >= @From
	END
	RETURN
END
GO
