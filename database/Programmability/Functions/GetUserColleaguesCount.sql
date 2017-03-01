USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserColleaguesCount
(
	@Username NVARCHAR(128)
)
RETURNS @Count TABLE
(
	[Count] INT
)
AS
BEGIN
	DECLARE @UserColleagues TABLE (User1 NVARCHAR(128), User2 NVARCHAR(128))
	DECLARE @ColleaguesTmp TABLE (User1 NVARCHAR(128))
	DECLARE @Tmp TABLE (Username NVARCHAR(128), FullName NVARCHAR(MAX))
	INSERT INTO @UserColleagues
	SELECT * FROM dbo.Colleagues WHERE User1 = @Username OR User2 = @Username

	INSERT @ColleaguesTmp
	SELECT User1 FROM @UserColleagues WHERE User1 <> @Username

	INSERT @ColleaguesTmp
	SELECT User2 FROM @UserColleagues WHERE User2 <> @Username
	
	INSERT @Tmp(Username, FullName)
	SELECT U.Username, U.FullName FROM @ColleaguesTmp AS UC INNER JOIN dbo.Users AS U ON U.Username = UC.User1
	
	INSERT @Count
	SELECT (Count(T.Username)) FROM @Tmp AS T;
	RETURN
END
GO
