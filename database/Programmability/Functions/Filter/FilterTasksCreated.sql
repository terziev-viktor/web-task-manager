USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION FilterTasksCreated
(
	@Username NVARCHAR(128),
	@Filter NVARCHAR(MAX)
)
RETURNS
@Filtered TABLE 
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
	INSERT @Filtered
	SELECT * FROM GetUserCreatedTasksOrderedByPriority(@Username, 1, -1) AS T WHERE T.Title LIKE '%' + @Filter + '%'

	RETURN
END
GO

