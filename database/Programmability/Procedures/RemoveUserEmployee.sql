SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE RemoveUserEmployee
	@User NVARCHAR(128),
	@Employee NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;

	IF EXISTS
		(SELECT * FROM dbo.ManagersEmployees WHERE (Manager = @User AND Employee = @Employee))
	BEGIN 
		DELETE ManagersEmployees
		WHERE (@User = Manager AND @Employee = Employee);
	END
	ELSE 
	BEGIN
		DECLARE @DBID INT;
		SET @DBID = DB_ID();

		DECLARE @DBNAME NVARCHAR(128);
		SET @DBNAME = DB_NAME();

		RAISERROR (N'Database ID:%d, Database name is: %s, ERROR: Not Employee', 10, 1, @DBID, @DBNAME);
	END
END
GO
