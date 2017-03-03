USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserSentEmployeeRequests
(
	@Username NVARCHAR(128)
)
RETURNS 
@Users_Recieved TABLE 
(
	User_Recieved NVARCHAR(128)
)
AS
BEGIN
	INSERT @Users_Recieved
	SELECT UER.User_Recieved FROM UserEmployeeRequests AS UER
	WHERE UER.User_Sent = @Username
	ORDER BY UER.User_Sent
	RETURN 
END
GO
