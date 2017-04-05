CREATE DATABASE WebTaskManagerDb
GO
USE WebTaskManagerDb
GO

CREATE TABLE [dbo].[Comments] (
    [CommentId] [int] NOT NULL IDENTITY,
    [Date] [datetime] NOT NULL,
    [Content] [nvarchar](max),
    [Author_Username] [nvarchar](128) NOT NULL,
    [Task_TaskId] [int] NOT NULL,
    CONSTRAINT [PK_dbo.Comments] PRIMARY KEY ([CommentId])
)



CREATE TABLE [dbo].[Users] (
    [Username] [nvarchar](128) NOT NULL,
    [FullName] [nvarchar](max),
    [Password] [nvarchar](max),
    CONSTRAINT [PK_dbo.Users] PRIMARY KEY ([Username])
)



CREATE TABLE [dbo].[Tasks] (
    [TaskId] [int] NOT NULL IDENTITY,
    [Title] [nvarchar](max) NOT NULL,
    [Description] [nvarchar](max),
    [Deadline] [datetime],
    [IsDone] [bit] NOT NULL,
    [IsArchived] [bit] NOT NULL,
    [Priority] [int] NOT NULL,
    [Progress] [int] NOT NULL,
    [Repeatability] [int] NOT NULL,
    [Creator_Username] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.Tasks] PRIMARY KEY ([TaskId])
)



CREATE TABLE [dbo].[Logins] (
    [LoginId] [nvarchar](128) NOT NULL,
    [Username] [nvarchar](max),
    [FullName] [nvarchar](max),
    CONSTRAINT [PK_dbo.Logins] PRIMARY KEY ([LoginId])
)



CREATE TABLE [dbo].[Colleagues] (
    [User1] [nvarchar](128) NOT NULL,
    [User2] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.Colleagues] PRIMARY KEY ([User1], [User2])
)



CREATE TABLE [dbo].[ManagersEmployees] (
    [Manager] [nvarchar](128) NOT NULL,
    [Employee] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.ManagersEmployees] PRIMARY KEY ([Manager], [Employee])
)



CREATE TABLE [dbo].[UserColleagueRequests] (
    [User_Sent] [nvarchar](128) NOT NULL,
    [User_Recieved] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.UserColleagueRequests] PRIMARY KEY ([User_Sent], [User_Recieved])
)



CREATE TABLE [dbo].[UserEmployeeRequests] (
    [User_Sent] [nvarchar](128) NOT NULL,
    [User_Recieved] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.UserEmployeeRequests] PRIMARY KEY ([User_Sent], [User_Recieved])
)



CREATE TABLE [dbo].[UserManagerRequests] (
    [User_Sent] [nvarchar](128) NOT NULL,
    [User_Recieved] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.UserManagerRequests] PRIMARY KEY ([User_Sent], [User_Recieved])
)



CREATE TABLE [dbo].[UsersTasks] (
    [Username] [nvarchar](128) NOT NULL,
    [TaskId] [int] NOT NULL,
    CONSTRAINT [PK_dbo.UsersTasks] PRIMARY KEY ([Username], [TaskId])
)



CREATE INDEX [IX_Author_Username] ON [dbo].[Comments]([Author_Username])



CREATE INDEX [IX_Task_TaskId] ON [dbo].[Comments]([Task_TaskId])



CREATE INDEX [IX_Creator_Username] ON [dbo].[Tasks]([Creator_Username])



CREATE INDEX [IX_User1] ON [dbo].[Colleagues]([User1])



CREATE INDEX [IX_User2] ON [dbo].[Colleagues]([User2])



CREATE INDEX [IX_Manager] ON [dbo].[ManagersEmployees]([Manager])



CREATE INDEX [IX_Employee] ON [dbo].[ManagersEmployees]([Employee])



CREATE INDEX [IX_User_Sent] ON [dbo].[UserColleagueRequests]([User_Sent])



CREATE INDEX [IX_User_Recieved] ON [dbo].[UserColleagueRequests]([User_Recieved])



CREATE INDEX [IX_User_Sent] ON [dbo].[UserEmployeeRequests]([User_Sent])



CREATE INDEX [IX_User_Recieved] ON [dbo].[UserEmployeeRequests]([User_Recieved])



CREATE INDEX [IX_User_Sent] ON [dbo].[UserManagerRequests]([User_Sent])



CREATE INDEX [IX_User_Recieved] ON [dbo].[UserManagerRequests]([User_Recieved])



CREATE INDEX [IX_Username] ON [dbo].[UsersTasks]([Username])



CREATE INDEX [IX_TaskId] ON [dbo].[UsersTasks]([TaskId])



ALTER TABLE [dbo].[Comments] ADD CONSTRAINT [FK_dbo.Comments_dbo.Users_Author_Username] FOREIGN KEY ([Author_Username]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[Comments] ADD CONSTRAINT [FK_dbo.Comments_dbo.Tasks_Task_TaskId] FOREIGN KEY ([Task_TaskId]) REFERENCES [dbo].[Tasks] ([TaskId]) ON DELETE CASCADE



ALTER TABLE [dbo].[Tasks] ADD CONSTRAINT [FK_dbo.Tasks_dbo.Users_Creator_Username] FOREIGN KEY ([Creator_Username]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[Colleagues] ADD CONSTRAINT [FK_dbo.Colleagues_dbo.Users_User1] FOREIGN KEY ([User1]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[Colleagues] ADD CONSTRAINT [FK_dbo.Colleagues_dbo.Users_User2] FOREIGN KEY ([User2]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[ManagersEmployees] ADD CONSTRAINT [FK_dbo.ManagersEmployees_dbo.Users_Manager] FOREIGN KEY ([Manager]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[ManagersEmployees] ADD CONSTRAINT [FK_dbo.ManagersEmployees_dbo.Users_Employee] FOREIGN KEY ([Employee]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[UserColleagueRequests] ADD CONSTRAINT [FK_dbo.UserColleagueRequests_dbo.Users_User_Sent] FOREIGN KEY ([User_Sent]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[UserColleagueRequests] ADD CONSTRAINT [FK_dbo.UserColleagueRequests_dbo.Users_User_Recieved] FOREIGN KEY ([User_Recieved]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[UserEmployeeRequests] ADD CONSTRAINT [FK_dbo.UserEmployeeRequests_dbo.Users_User_Sent] FOREIGN KEY ([User_Sent]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[UserEmployeeRequests] ADD CONSTRAINT [FK_dbo.UserEmployeeRequests_dbo.Users_User_Recieved] FOREIGN KEY ([User_Recieved]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[UserManagerRequests] ADD CONSTRAINT [FK_dbo.UserManagerRequests_dbo.Users_User_Sent] FOREIGN KEY ([User_Sent]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[UserManagerRequests] ADD CONSTRAINT [FK_dbo.UserManagerRequests_dbo.Users_User_Recieved] FOREIGN KEY ([User_Recieved]) REFERENCES [dbo].[Users] ([Username])



ALTER TABLE [dbo].[UsersTasks] ADD CONSTRAINT [FK_dbo.UsersTasks_dbo.Users_Username] FOREIGN KEY ([Username]) REFERENCES [dbo].[Users] ([Username]) ON DELETE CASCADE



ALTER TABLE [dbo].[UsersTasks] ADD CONSTRAINT [FK_dbo.UsersTasks_dbo.Tasks_TaskId] FOREIGN KEY ([TaskId]) REFERENCES [dbo].[Tasks] ([TaskId]) ON DELETE CASCADE

