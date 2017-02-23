USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE InsertUser
	@Username NVARCHAR(128), 
	@FullName NVARCHAR(128), 
	@Password NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO Users ([Username],[FullName], [Password])
	VALUES (@Username, @FullName, @Password)
END
GO
