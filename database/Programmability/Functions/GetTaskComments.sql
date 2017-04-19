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
	Author_Username	NVARCHAR(128),
	Task_TaskId	INT,
	Author_FullName NVARCHAR(MAX)
)
AS
BEGIN
	INSERT @Comments
	SELECT C.*, U.FullName FROM Comments AS C 
	INNER JOIN Users AS U ON U.Username = C.Author_Username
	WHERE C.Task_TaskId = @TaskId
	RETURN
END
GO