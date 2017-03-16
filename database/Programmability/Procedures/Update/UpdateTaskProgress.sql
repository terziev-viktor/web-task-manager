USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE UpdateTaskProgress
	@TaskId int,	 
	@NewProgress int
AS
BEGIN
	
	SET NOCOUNT ON;
	UPDATE Tasks
	SET Progress = @NewProgress
	WHERE TaskId = @TaskId

END
GO