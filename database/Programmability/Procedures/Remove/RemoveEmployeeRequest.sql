USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE RemoveEmployeeRequest
	@Sent NVARCHAR(128),
	@Recieved NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
	DELETE UserEmployeeRequests
	WHERE User_Sent = @Sent AND User_Recieved = @Recieved
END
GO


