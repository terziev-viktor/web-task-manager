USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE InsertTask
	@Title	NVARCHAR(MAX),
	@Description NVARCHAR(MAX),	
	@Deadline DATETIME,
	@IsDone	BIT,
	@Priority INT,
	@Progress INT,
	@Repeatability INT,
	@Creator_Username NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
	SET DATEFORMAT dmy;
	DECLARE @EUDeadline DATETIME;
	SET @EUDeadline = CONVERT(Datetime, @Deadline, 105);

	INSERT INTO Tasks ([Title], [Description], [Deadline], [IsDone], [Priority],[Progress],[Repeatability],[Creator_Username])
	OUTPUT Ident_Current('Tasks') AS TaskId
	VALUES (@Title, @Description, @EUDeadline, @IsDone, @Priority, @Progress, @Repeatability, @Creator_Username);
END
GO