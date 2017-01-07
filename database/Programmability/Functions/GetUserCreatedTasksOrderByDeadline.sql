SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserCreatedTasksOrderByDeadline
(	
	@Creator_Username NVARCHAR(128)
)
RETURNS TABLE
AS
RETURN
(
	SELECT * FROM Tasks AS T WHERE T.Creator_Username = @Creator_Username ORDER BY T.[Deadline]
)
GO
