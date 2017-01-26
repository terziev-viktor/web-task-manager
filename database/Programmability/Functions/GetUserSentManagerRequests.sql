SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserSentManagerRequests
(
	@Username NVARCHAR(128)
)
RETURNS 
-- People who recieved the requests
@Users_Recieved TABLE 
(
	User_Recieved NVARCHAR(128)
)
AS
BEGIN
	INSERT @Users_Recieved
	SELECT UER.User_Recieved FROM UserManagerRequests AS UER
	WHERE UER.User_Sent = @Username
	ORDER BY UER.User_Recieved
	RETURN 
END
GO
