SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION GetFilesOfComment
(
	@Id INT
)
RETURNS TABLE
AS
RETURN
(
	SELECT * FROM Files WHERE Comment_CommentId = @Id
)
