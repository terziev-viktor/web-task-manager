USE WebTaskManagerDb
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION GetUserRelational
(
	@Current NVARCHAR(128),
	@Username NVARCHAR(128)
)
RETURNS
@Result TABLE
(
	Username NVARCHAR(128),
	FullName NVARCHAR(MAX),
	IsColleague BIT,
	IsManager BIT,
	IsEmployee BIT,
	RecievedEmployeeRequest BIT,
	RecievedManagerRequest BIT
)
AS
BEGIN
	INSERT @Result([Username], [FullName])
	SELECT u.Username, u.FullName FROM Users AS u WHERE u.Username = @Username

	IF (EXISTS (SELECT * FROM Colleagues where (user1 = @Current and user2 = @Username) or (user1 = @Username and user2 = @Current)))
	begin
		UPDATE @result
		SET [IsColleague] = 1
		WHERE Username = @Username
	end

	IF (EXISTS (SELECT * FROM ManagersEmployees WHERE Manager = @Username AND Employee = @Current))
	begin
		UPDATE @Result
		SET IsManager = 1
		WHERE Username = @Username
	end

	if(exists (SELECT * FROM ManagersEmployees WHERE Manager = @Current AND Employee = @Username))
	begin 
		UPDATE @Result
		SET IsEmployee = 1
		WHERE Username = @Username
	end

	if(exists (select * from UserEmployeeRequests WHERE User_Sent = @Current AND User_Recieved = @Username))
	begin
		UPDATE @Result
		SET RecievedEmployeeRequest = 1
		WHERE Username = @Username

	end

	if(exists (select * from UserManagerRequests WHERE User_Sent = @Current AND User_Recieved = @Username))
	begin
		UPDATE @Result
		SET RecievedManagerRequest = 1
		WHERE Username = @Username
	end
	RETURN 
END
GO