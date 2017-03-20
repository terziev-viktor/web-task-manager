USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserColleaguesRelational
(
	@Username NVARCHAR(128),
	@From INT,
	@Size INT
)
RETURNS 
@Colleagues TABLE
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX),
	IsManager NVARCHAR(128),
	IsEmployee NVARCHAR(128),
	RecievedEmployeeRequest NVARCHAR(128),
	RecievedManagerRequest NVARCHAR(128)
)
AS
BEGIN
	INSERT @Colleagues
	SELECT ColleaguesOnly.*, SER.User_Recieved AS 'RecievedEmployeeRequest', SMR.User_Recieved AS 'RecievedManagerRequest' FROM (SELECT * FROM (SELECT UC.*, UM.Username AS 'IsManager', Ue.Username AS 'IsEmployee' FROM GetUserColleagues(@Username, @From, @Size) AS UC
	LEFT JOIN GetUserManagers(@Username, @From, @Size) AS UM ON UM.Username = UC.Username
	LEFT JOIN GetUserEmployees(@Username, @From, @Size) AS UE ON UE.Username = UC.Username) AS Relations) As ColleaguesOnly
	LEFT JOIN GetUserSentEmployeeRequests(@Username) AS SER ON SER.User_Recieved = ColleaguesOnly.Username
	LEFT JOIN GetUserSentManagerRequests(@Username) AS SMR ON SMR.User_Recieved = ColleaguesOnly.Username
	RETURN 
END
GO
