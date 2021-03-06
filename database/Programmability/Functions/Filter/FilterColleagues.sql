USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION FilterColleagues
(
	@Username NVARCHAR(128),
	@Filter NVARCHAR(MAX)
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
	
	INSERT @Colleagues(Username, FullName)
	SELECT U.Username, U.FullName FROM @ColleaguesTmp AS UC INNER JOIN dbo.Users AS U ON U.Username = UC.User1
	WHERE U.Username LIKE '%' + @Filter + '%' OR U.FullName LIKE '%' + @Filter + '%'

	RETURN 
END
GO
