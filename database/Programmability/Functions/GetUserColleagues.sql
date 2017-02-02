USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserColleagues
(
	@Username NVARCHAR(128)
)
RETURNS 
@Colleagues TABLE 
(
	Colleague NVARCHAR(128)
)
AS
BEGIN
	DECLARE @UserColleagues TABLE (User1 NVARCHAR(128), User2 NVARCHAR(128))
	
	INSERT INTO @UserColleagues
	SELECT * FROM dbo.Colleagues WHERE User1 = @Username OR User2 = @Username

	INSERT @Colleagues
	SELECT User1 FROM @UserColleagues WHERE User1 <> @Username

	INSERT @Colleagues
	SELECT User2 FROM @UserColleagues WHERE User2 <> @Username
	
	RETURN 
END
GO