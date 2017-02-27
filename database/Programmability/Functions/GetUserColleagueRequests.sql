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
RETURNS @ColleagueRequests TABLE
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX)
) 
AS
BEGIN
	Declare @ColleagueReqTmp TABLE (Username NVARCHAR(128))
	INSERT @ColleagueReqTmp
	SELECT User_Sent FROM dbo.UserColleagueRequests WHERE User_Recieved = @Username

	INSERT @ColleagueRequests
	SELECT U.Username, U.FullName From @ColleagueReqTmp AS CR INNER JOIN Users AS U ON U.Username = CR.Username

	RETURN
END
