SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertFileToTask
	@TaskId INT,
	@Fieldname NVARCHAR(MAX),
	@OriginalName NVARCHAR(MAX),
	@Encoding NVARCHAR(MAX),
	@Mimetype NVARCHAR(MAX),
	@Destination NVARCHAR(MAX),
	@Filename NVARCHAR(MAX),
	@Path NVARCHAR(MAX),
	@Size INT
AS
BEGIN
	DECLARE @ID INT

	INSERT Files([Fieldname], [OriginalName], [Encoding], [Mimetype], [Destination], [Filename], [Path], [Size], [Task_TaskId])
	VALUES (@Fieldname, @OriginalName, @Encoding, @Mimetype, @Destination, @Filename, @Path, @Size, @TaskId);
	SET @ID = SCOPE_IDENTITY()

	RETURN @ID
END
GO
