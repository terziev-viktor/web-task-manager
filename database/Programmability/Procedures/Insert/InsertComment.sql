USE WebTaskManagerDb
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertComment
	@Content NVARCHAR(MAX),
	@Author_Username NVARCHAR(128),
	@Task_TaskId INT
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Comments([Content], [Author_Username], [Task_TaskId])
	VALUES (@Content, @Author_Username, @Task_TaskId)

END
GO
