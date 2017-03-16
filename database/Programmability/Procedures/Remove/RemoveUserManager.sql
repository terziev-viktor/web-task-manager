SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE RemoveUserManager
	@User NVARCHAR(128),
	@Manager NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;

	IF EXISTS
		(SELECT * FROM dbo.ManagersEmployees WHERE (Manager = @Manager AND Employee = @User))
	BEGIN 
		DELETE ManagersEmployees
		WHERE (@User = Employee AND @Manager = Manager);

	END
	ELSE 
	BEGIN
		DECLARE @DBID INT;
		SET @DBID = DB_ID();

		DECLARE @DBNAME NVARCHAR(128);
		SET @DBNAME = DB_NAME();

		RAISERROR (N'Database ID:%d, Database name is: %s, ERROR: Not Manager', 10, 1, @DBID, @DBNAME);
	END
END
GO
