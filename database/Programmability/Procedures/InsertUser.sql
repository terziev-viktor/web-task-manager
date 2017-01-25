	USE WebTaskManagerDb
	GO

	SET ANSI_NULLS ON
	GO
	SET QUOTED_IDENTIFIER ON
	GO

	CREATE PROCEDURE InsertUser
		@Username NVARCHAR(128), 
		@Password NVARCHAR(128)
	AS
	BEGIN
		SET NOCOUNT ON;

		INSERT INTO Users ([Username], [Password])
		VALUES (@Username, @Password)

	END
	GO
