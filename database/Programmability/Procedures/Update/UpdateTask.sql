USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE UpdateTask
	@TaskId INT,
	@Title NVARCHAR(MAX),
	@Description NVARCHAR(MAX),
	@Deadline DATETIME,
	@Priority INT,
	@Progress INT,
	@Repeatability INT,
	@IsArchived BIT
AS
BEGIN
	SET NOCOUNT ON;
	IF (@Title <> '')
	BEGIN
		UPDATE Tasks
		SET Title = @Title
		WHERE TaskId = @TaskId
	END

	IF (@Description <> '')
	BEGIN
		UPDATE Tasks
		SET [Description] = @Description
		WHERE TaskId = @TaskId
	END

	IF (@Deadline <> '')
	BEGIN
		UPDATE Tasks
		SET Deadline = @Deadline
		WHERE TaskId = @TaskId
	END

	IF (@Priority <> '')
	BEGIN
		UPDATE Tasks
		SET [Priority] = @Priority
		WHERE TaskId = @TaskId
	END

	IF (@Progress <> '')
	BEGIN
		UPDATE Tasks
		SET Progress = @Progress
		WHERE TaskId = @TaskId

		IF (@Progress = '100')
		BEGIN
			UPDATE Tasks
			SET IsDone = 1
			WHERE TaskId = @TaskId
		END
		ELSE
		BEGIN
		UPDATE Tasks
			SET IsDone = 0
			WHERE TaskId = @TaskId
		END
	END

	IF (@Repeatability <> '')
	BEGIN
		UPDATE Tasks
		SET Repeatability = @Repeatability
		WHERE TaskId = @TaskId
	END

	IF (@IsArchived <> '')
	BEGIN
		UPDATE Tasks
		SET IsArchived = @IsArchived
		WHERE TaskId = @TaskId
	END
END
GO