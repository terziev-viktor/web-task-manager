-- ================================================
-- Template generated from Template Explorer using:
-- Create Inline Function (New Menu).SQL
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION GetUserByUsername
(	
	-- Add the parameters for the function here
	@Username NVARCHAR(128)
)
RETURNS TABLE 
AS
RETURN 
(
	-- Add the SELECT statement with parameter references here
	SELECT TOP 1 U.Username, U.[Password] FROM Users AS U WHERE U.Username = @Username
)
GO
