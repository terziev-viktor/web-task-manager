USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserColleagueRequests
(	
	@Username NVARCHAR(128)
)
RETURNS TABLE 
AS
RETURN
(
	SELECT User_Sent FROM dbo.UserColleagueRequests WHERE User_Recieved = @Username
)
GO
