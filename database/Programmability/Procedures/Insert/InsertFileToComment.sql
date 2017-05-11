SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertFileToComment
	@CommentId INT,
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

	INSERT Files([Fieldname], [OriginalName], [Encoding], [Mimetype], [Destination], [Filename], [Path], [Size], [Comment_CommentId])
	VALUES (@Fieldname, @OriginalName, @Encoding, @Mimetype, @Destination, @Filename, @Path, @Size, @CommentId);
	SET @ID = SCOPE_IDENTITY()

	RETURN @ID
END
GO