USE WebTaskManagerDb
GO

INSERT [dbo].[Colleagues] ([User1], [User2])
VALUES ('Gosho', 'Minka')

INSERT [dbo].[Colleagues] ([User1], [User2])
VALUES ('Minka', 'MITKO')

INSERT [dbo].[Colleagues] ([User1], [User2])
VALUES ('Minka', 'Stamat')

INSERT [dbo].[Colleagues] ([User1], [User2])
VALUES ('Pesho', 'Minka')

INSERT [dbo].[Colleagues] ([User1], [User2])
VALUES ('Pesho', 'MITKO')

INSERT [dbo].[Colleagues] ([User1], [User2])
VALUES ('Pesho', 'Stamat')

INSERT [dbo].[Colleagues] ([User1], [User2])
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