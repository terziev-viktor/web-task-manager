CREATE TABLE [dbo].[Tasks] (
    [TaskId] [int] NOT NULL IDENTITY,
    [Title] [nvarchar](max) NOT NULL,
    [Description] [nvarchar](max),
    [Deadline] [datetime] NOT NULL,
    [IsDone] [bit] NOT NULL,
    [Priority] [int] NOT NULL,
    [Progress] [int] NOT NULL,
    [Repeatability] [int] NOT NULL,
    [Creator_Username] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.Tasks] PRIMARY KEY ([TaskId])
)

CREATE TABLE [dbo].[Users] (
    [Username] [nvarchar](128) NOT NULL,
    [Password] [nvarchar](max),
    CONSTRAINT [PK_dbo.Users] PRIMARY KEY ([Username])
)
CREATE TABLE [dbo].[UserEmployees] (
    [Username] [nvarchar](128) NOT NULL,
    [Employee] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.UserEmployees] PRIMARY KEY ([Username], [Employee])
)

CREATE TABLE [dbo].[UserManagers] (
    [Username] [nvarchar](128) NOT NULL,
    [Manager] [nvarchar](128) NOT NULL,
    CONSTRAINT [PK_dbo.UserManagers] PRIMARY KEY ([Username], [Manager])
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

CREATE INDEX [IX_Creator_Username] ON [dbo].[Tasks]([Creator_Username])

CREATE INDEX [IX_Username] ON [dbo].[UserEmployees]([Username])

CREATE INDEX [IX_Employee] ON [dbo].[UserEmployees]([Employee])

CREATE INDEX [IX_Username] ON [dbo].[UserManagers]([Username])

CREATE INDEX [IX_Manager] ON [dbo].[UserManagers]([Manager])

CREATE INDEX [IX_User_Sent] ON [dbo].[UserEmployeeRequests]([User_Sent])

CREATE INDEX [IX_User_Recieved] ON [dbo].[UserEmployeeRequests]([User_Recieved])

CREATE INDEX [IX_User_Sent] ON [dbo].[UserManagerRequests]([User_Sent])

CREATE INDEX [IX_User_Recieved] ON [dbo].[UserManagerRequests]([User_Recieved])

CREATE INDEX [IX_Username] ON [dbo].[UsersTasks]([Username])

CREATE INDEX [IX_TaskId] ON [dbo].[UsersTasks]([TaskId])

ALTER TABLE [dbo].[Tasks] 
ADD CONSTRAINT [FK_dbo.Tasks_dbo.Users_Creator_Username] 
FOREIGN KEY ([Creator_Username]) 
REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserEmployees] 
ADD CONSTRAINT [FK_dbo.UserEmployees_dbo.Users_Username]
FOREIGN KEY ([Username]) REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserEmployees] 
ADD CONSTRAINT [FK_dbo.UserEmployees_dbo.Users_Employee]
 FOREIGN KEY ([Employee])
  REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserManagers] 
ADD CONSTRAINT [FK_dbo.UserManagers_dbo.Users_Username] 
FOREIGN KEY ([Username]) 
REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserManagers] 
ADD CONSTRAINT [FK_dbo.UserManagers_dbo.Users_Manager] 
FOREIGN KEY ([Manager]) 
REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserEmployeeRequests] 
ADD CONSTRAINT [FK_dbo.UserEmployeeRequests_dbo.Users_User_Sent] 
FOREIGN KEY ([User_Sent]) 
REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserEmployeeRequests] 
ADD CONSTRAINT [FK_dbo.UserEmployeeRequests_dbo.Users_User_Recieved] 
FOREIGN KEY ([User_Recieved]) 
REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserManagerRequests] 
ADD CONSTRAINT [FK_dbo.UserManagerRequests_dbo.Users_User_Sent] 
FOREIGN KEY ([User_Sent]) 
REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UserManagerRequests] 
ADD CONSTRAINT 
[FK_dbo.UserManagerRequests_dbo.Users_User_Recieved] 
FOREIGN KEY ([User_Recieved]) 
REFERENCES [dbo].[Users] ([Username])

ALTER TABLE [dbo].[UsersTasks] 
ADD CONSTRAINT [FK_dbo.UsersTasks_dbo.Users_Username] 
FOREIGN KEY ([Username]) 
REFERENCES [dbo].[Users] ([Username]) 
ON DELETE CASCADE

ALTER TABLE [dbo].[UsersTasks] 
ADD CONSTRAINT [FK_dbo.UsersTasks_dbo.Tasks_TaskId] 
FOREIGN KEY ([TaskId]) 
REFERENCES [dbo].[Tasks] ([TaskId]) 
ON DELETE CASCADE
