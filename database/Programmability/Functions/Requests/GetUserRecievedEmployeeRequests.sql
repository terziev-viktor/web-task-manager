USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserRecievedEmployeeRequests
(
	@Username NVARCHAR(128)
)
RETURNS
@Users_Sent TABLE 
(
	User_Sent NVARCHAR(128),
	FullName NVARCHAR(MAX)
)
AS
BEGIN
	DECLARE @Tmp TABLE (User_Sent NVARCHAR(128))

	INSERT @Tmp
	SELECT UER.User_Sent FROM UserEmployeeRequests AS UER
	WHERE UER.User_Recieved = @Username
	ORDER BY UER.User_Sent

	INSERT @Users_Sent([User_Sent], [FullName])
	SELECT U.Username, U.FullName FROM @Tmp AS T INNER JOIN Users AS U ON U.Username = T.User_Sent
	RETURN
END
GO
