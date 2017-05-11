USE WebTaskManagerDb
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertComment
	@Content NVARCHAR(MAX),
	@Date DATETIME,
	@Author_Username NVARCHAR(128),
	@Task_TaskId INT
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Comments([Content], [Date], [Author_Username], [Task_TaskId])
	VALUES (@Content, @Date, @Author_Username, @Task_TaskId)

END
GO

USE WebTaskManagerDb
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION InsertCommentGetId (

	@Content NVARCHAR(MAX),
	@Date DATETIME,
	@Author_Username NVARCHAR(128),
	@Task_TaskId INT
	)
	RETURNS @Result TABLE (Id INT) 
AS
BEGIN

	EXEC InsertComment @Content, @Date, @Author_Username, @Task_TaskId
	INSERT @Result (Id) VALUES (IDENT_CURRENT('Comments'))
	RETURN 
END
GO
