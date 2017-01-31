USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetTaskComments
(
	@TaskId AS INT
)
RETURNS 
@Comments TABLE 
(
	CommentId INT,
	[Date]	DATETIME,
	[Content]	NVARCHAR(MAX),
	Author_Username	NVARCHAR(128)	,
	Task_TaskId	INT	
)
AS
BEGIN
	INSERT @Comments
	SELECT * FROM Comments AS C WHERE C.Task_TaskId = @TaskId
	RETURN 
END
GO