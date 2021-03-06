SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION GetAvatar
(
	@Username NVARCHAR(128)
)
RETURNS TABLE
AS
RETURN
(
	SELECT F.Path FROM USERS AS U
	INNER JOIN Files AS F ON F.Id = U.Avatar_Id
	WHERE U.Username = @Username
)
GO

