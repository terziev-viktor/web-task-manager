SET ANSI_NULLS ON
GO
USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE InsertAvatar
	@Username NVARCHAR(128),
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

	INSERT Files([Fieldname], [OriginalName], [Encoding], [Mimetype], [Destination], [Filename], [Path], [Size])
	VALUES (@Fieldname, @OriginalName, @Encoding, @Mimetype, @Destination, @Filename, @Path, @Size);
	SET @ID = SCOPE_IDENTITY()

	UPDATE USERS
	SET Avatar_Id = @ID
	WHERE Username = @Username;

	RETURN @ID
END
GO
