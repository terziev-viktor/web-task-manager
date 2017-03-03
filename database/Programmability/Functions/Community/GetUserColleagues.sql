USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserColleagues
(
	@Username NVARCHAR(128),
	@From INT,
	@Size INT
)
RETURNS 
@Colleagues TABLE
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX)
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

	IF (@Size <> -1)
	BEGIN
		INSERT @Colleagues ([Username], [FullName])
		SELECT TOP (@Size) T.Username, T.FullName FROM (SELECT ROW_NUMBER() OVER (ORDER BY t.Username) AS rownumber, * FROM @Tmp AS t) AS T
		WHERE rownumber >= @From
	END
	ELSE
	BEGIN
		INSERT @Colleagues ([Username], [FullName])
		SELECT T.Username, T.FullName FROM (SELECT ROW_NUMBER() OVER (ORDER BY t.Username) AS rownumber, * FROM @Tmp AS t) AS T
		WHERE rownumber >= @From
	END
	RETURN 
END
GO
