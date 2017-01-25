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

INSERT [dbo].[Tasks]([Title], [Description], [Deadline], [IsDone], [Priority], [Progress], [Repeatability], [Creator_Username])
VALUES ('Go', 'To the church', '11-Mar-17 12:00:00 AM', 'False', '0', '20', '2', 'Yordan')

INSERT [dbo].[Comments]([Date], [Content], [Author_Username], [Task_TaskId])
VALUES ('25-Jan-17 4:54:48 PM', 'Very nice task', 'MITKO', '6')

INSERT [dbo].[Comments]([Date], [Content], [Author_Username], [Task_TaskId])
VALUES ('25-Jan-17 4:54:48 PM', 'This task sucks', 'Pesho', '2')

INSERT [dbo].[Comments]([Date], [Content], [Author_Username], [Task_TaskId])
VALUES ('25-Jan-17 4:54:48 PM', 'Can somebody help me with this ? ;*', 'Minka', '1')

INSERT [dbo].[Comments]([Date], [Content], [Author_Username], [Task_TaskId])
VALUES ('25-Jan-17 4:54:48 PM', 'How can I Do this !??', 'Yordan', '2')

INSERT [dbo].[Comments]([Date], [Content], [Author_Username], [Task_TaskId])
VALUES ('25-Jan-17 4:54:48 PM', 'I have no idea what Im doing', 'Stefan', '2')

INSERT INTO [dbo].[UsersTasks] ([Username], [TaskId])
values ('Minka', 1), ('Stamat', 2), ('Stamat', 3), ('MITKO', 3), ('Stefan', 4), ('Pesho', 4), ('Pesho', 2)