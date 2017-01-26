SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserRecievedManagerRequests
(
	@Username NVARCHAR(128)
)
RETURNS 
-- People who sent the requests
@Users_Sent TABLE 
(
	User_Sent NVARCHAR(128)
)
AS
BEGIN
	INSERT @Users_Sent
	SELECT UER.User_Sent FROM UserManagerRequests AS UER
	WHERE UER.User_Recieved = @Username
	ORDER BY UER.User_Sent
	RETURN 
END
GO
