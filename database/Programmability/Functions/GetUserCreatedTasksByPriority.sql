USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserCreatedTasksOrderedByPriority
(
	@Creator_Username NVARCHAR(128),
	@From AS INT,
	@To AS INT
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
	WHERE T.Creator_Username = @Creator_Username
	ORDER BY T.[Priority]

	INSERT @CreatorTasks
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
	RETURN 
END
GO
