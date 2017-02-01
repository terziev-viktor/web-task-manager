USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE UpdateTask
	@TaskId int,
	@Title nvarchar(MAX),
	@Description nvarchar(MAX),
	@Deadline datetime,	 
	@IsDone bit,
	@Priority int,	 
	@Progress int,	 
	@Repeatability int,
	@Creator_Username nvarchar(128)
AS
BEGIN
	
	SET NOCOUNT ON;
	UPDATE Tasks
	SET Title = @Title, [Description] = @Description, Deadline = @Deadline, IsDone = @IsDone, [Priority] = @Priority, Progress=@Progress,
	Repeatability = @Repeatability 
	WHERE TaskId = @TaskId

END
GO
