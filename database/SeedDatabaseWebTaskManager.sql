USE WebTaskManagerDb
GO

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Boiko', '121246323456')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Gosho', '213562')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Marko', '75345')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Minka', '6436')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('MITKO', 'P@55W0RD345')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Pesho', '123456')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Sashko', '87523')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Stamat', '768563254')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Stanimir', '532432')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Stefan', '1235326')

INSERT [dbo].[Users]([Username], [Password])
VALUES ('Yordan', '124732')

INSERT [dbo].[UserEmployeeRequests]([User_Sent], [User_Recieved])
VALUES ('Gosho', 'Minka')

INSERT [dbo].[UserEmployeeRequests]([User_Sent], [User_Recieved])
VALUES ('Minka', 'MITKO')

INSERT [dbo].[UserEmployeeRequests]([User_Sent], [User_Recieved])
VALUES ('Minka', 'Stamat')

INSERT [dbo].[UserEmployeeRequests]([User_Sent], [User_Recieved])
VALUES ('Pesho', 'Minka')

INSERT [dbo].[UserEmployeeRequests]([User_Sent], [User_Recieved])
VALUES ('Pesho', 'MITKO')

INSERT [dbo].[UserEmployeeRequests]([User_Sent], [User_Recieved])
VALUES ('Pesho', 'Stamat')

INSERT [dbo].[UserManagerRequests]([User_Sent], [User_Recieved])
VALUES ('Minka', 'Pesho')

INSERT [dbo].[UserManagerRequests]([User_Sent], [User_Recieved])
VALUES ('MITKO', 'Minka')

INSERT [dbo].[Tasks] ([Title], [Description], [Deadline], [IsDone], [Priority], [Progress], [Repeatability], [Creator_Username])
VALUES ('Clean', 'Some Shit in the toilet',  '01-Feb-17 9:00:00 AM', 1, 0, 1, 2, 'Pesho'), 
		('Do', 'Some Work',  '01-Feb-17 3:00:00 AM', 1, 0, 1, 2, 'Pesho'), 
		('Clean', 'Some Shit in the toilet',  '01-Feb-17 9:00:00 AM', 1, 0, 1, 2, 'Pesho'), 
		('Slay', 'A Dragon',  '01-Feb-17 9:00:00 AM', 0, 1, 1, 2, 'Pesho');

INSERT INTO [dbo].[UsersTasks] ([Username], [TaskId])
values ('Minka', 1), ('Stamat', 2), ('Stamat', 3), ('MITKO', 3), ('Stefan', 4), ('Pesho', 4), ('Pesho', 2)