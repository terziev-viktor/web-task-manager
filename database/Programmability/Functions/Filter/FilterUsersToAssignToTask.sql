USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION FilterUsersToAssignToTask
(
	@Username NVARCHAR(128),
	@Filter NVARCHAR(MAX),
	@TaskId INT
)
RETURNS 
@Colleagues TABLE
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX)
)
AS
BEGIN
	DECLARE @UserColleagues TABLE (Username NVARCHAR(128), FullName NVARCHAR(MAX))
	DECLARE @Tmp AS TABLE(Username NVARCHAR(128), FullName NVARCHAR(MAX), IsManager NVARCHAR(128))
	DECLARE @ColleaguesAndAssignedFiltered TABLE (Username NVARCHAR(128), FullName NVARCHAR(MAX))

	INSERT @UserColleagues ([Username], [FullName])
	SELECT * FROM GetUserColleagues(@Username, 1, -1)

	INSERT @Tmp([Username], [FullName], [IsManager])
	SELECT * FROM GetUserColleagues(@Username, 1, -1) AS C
	LEFT JOIN (SELECT Username AS 'IsManager' FROM GetUserManagers(@Username, 1, -1)) AS M 
	ON M.IsManager = C.Username

	INSERT @ColleaguesAndAssignedFiltered([Username], [FullName])
	SELECT T.Username, T.FullName FROM @Tmp AS T WHERE T.IsManager IS NULL
	AND (T.Username LIKE '%' + @Filter + '%' OR T.FullName LIKE '%' + @Filter + '%')

	INSERT @Colleagues
	SELECT FU.Username, FU.FullName FROM @ColleaguesAndAssignedFiltered AS FU LEFT JOIN
	(SELECT G.Username AS 'Assigned' FROM GetTaskAssignedUsersOrderedByUsername(@TaskId) AS G) AS AssignedUsers
	ON AssignedUsers.Assigned = FU.Username
	WHERE AssignedUsers.Assigned IS NULL

	RETURN 
END
GO
