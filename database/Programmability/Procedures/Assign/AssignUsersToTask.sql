USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE AssignUsersToTask
	@TaskId INT, 
	@UsersStr NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO dbo.UsersTasks
	SELECT LTRIM(RTRIM(value)), @TaskId
	FROM STRING_SPLIT(@UsersStr, ',')
	WHERE RTRIM(value) <> '';
END
GO

