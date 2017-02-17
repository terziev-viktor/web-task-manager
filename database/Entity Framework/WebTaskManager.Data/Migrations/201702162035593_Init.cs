namespace WebTaskManager.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Comments",
                c => new
                    {
                        CommentId = c.Int(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Content = c.String(),
                        Author_Username = c.String(nullable: false, maxLength: 128),
                        Task_TaskId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CommentId)
                .ForeignKey("dbo.Users", t => t.Author_Username)
                .ForeignKey("dbo.Tasks", t => t.Task_TaskId, cascadeDelete: true)
                .Index(t => t.Author_Username)
                .Index(t => t.Task_TaskId);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Username = c.String(nullable: false, maxLength: 128),
                        Password = c.String(),
                    })
                .PrimaryKey(t => t.Username);
                
            CreateTable(
                "dbo.Tasks",
                c => new
                    {
                        TaskId = c.Int(nullable: false, identity: true),
                        Title = c.String(nullable: false),
                        Description = c.String(),
                        Deadline = c.DateTime(nullable: false),
                        IsDone = c.Boolean(nullable: false),
                        Priority = c.Int(nullable: false),
                        Progress = c.Int(nullable: false),
                        Repeatability = c.Int(nullable: false),
                        Creator_Username = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.TaskId)
                .ForeignKey("dbo.Users", t => t.Creator_Username)
                .Index(t => t.Creator_Username);
            
            CreateTable(
                "dbo.Colleagues",
                c => new
                    {
                        User1 = c.String(nullable: false, maxLength: 128),
                        User2 = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.User1, t.User2 })
                .ForeignKey("dbo.Users", t => t.User1)
                .ForeignKey("dbo.Users", t => t.User2)
                .Index(t => t.User1)
                .Index(t => t.User2);
            
            CreateTable(
                "dbo.ManagersEmployees",
                c => new
                    {
                        Manager = c.String(nullable: false, maxLength: 128),
                        Employee = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.Manager, t.Employee })
                .ForeignKey("dbo.Users", t => t.Manager)
                .ForeignKey("dbo.Users", t => t.Employee)
                .Index(t => t.Manager)
                .Index(t => t.Employee);
            
            CreateTable(
                "dbo.UserColleagueRequests",
                c => new
                    {
                        User_Sent = c.String(nullable: false, maxLength: 128),
                        User_Recieved = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.User_Sent, t.User_Recieved })
                .ForeignKey("dbo.Users", t => t.User_Sent)
                .ForeignKey("dbo.Users", t => t.User_Recieved)
                .Index(t => t.User_Sent)
                .Index(t => t.User_Recieved);
            
            CreateTable(
                "dbo.UserEmployeeRequests",
                c => new
                    {
                        User_Sent = c.String(nullable: false, maxLength: 128),
                        User_Recieved = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.User_Sent, t.User_Recieved })
                .ForeignKey("dbo.Users", t => t.User_Sent)
                .ForeignKey("dbo.Users", t => t.User_Recieved)
                .Index(t => t.User_Sent)
                .Index(t => t.User_Recieved);
            
            CreateTable(
                "dbo.UserManagerRequests",
                c => new
                    {
                        User_Sent = c.String(nullable: false, maxLength: 128),
                        User_Recieved = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.User_Sent, t.User_Recieved })
                .ForeignKey("dbo.Users", t => t.User_Sent)
                .ForeignKey("dbo.Users", t => t.User_Recieved)
                .Index(t => t.User_Sent)
                .Index(t => t.User_Recieved);
            
            CreateTable(
                "dbo.UsersTasks",
                c => new
                    {
                        Username = c.String(nullable: false, maxLength: 128),
                        TaskId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Username, t.TaskId })
                .ForeignKey("dbo.Users", t => t.Username, cascadeDelete: true)
                .ForeignKey("dbo.Tasks", t => t.TaskId, cascadeDelete: true)
                .Index(t => t.Username)
                .Index(t => t.TaskId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Comments", "Task_TaskId", "dbo.Tasks");
            DropForeignKey("dbo.Comments", "Author_Username", "dbo.Users");
            DropForeignKey("dbo.UsersTasks", "TaskId", "dbo.Tasks");
            DropForeignKey("dbo.UsersTasks", "Username", "dbo.Users");
            DropForeignKey("dbo.UserManagerRequests", "User_Recieved", "dbo.Users");
            DropForeignKey("dbo.UserManagerRequests", "User_Sent", "dbo.Users");
            DropForeignKey("dbo.UserEmployeeRequests", "User_Recieved", "dbo.Users");
            DropForeignKey("dbo.UserEmployeeRequests", "User_Sent", "dbo.Users");
            DropForeignKey("dbo.UserColleagueRequests", "User_Recieved", "dbo.Users");
            DropForeignKey("dbo.UserColleagueRequests", "User_Sent", "dbo.Users");
            DropForeignKey("dbo.ManagersEmployees", "Employee", "dbo.Users");
            DropForeignKey("dbo.ManagersEmployees", "Manager", "dbo.Users");
            DropForeignKey("dbo.Tasks", "Creator_Username", "dbo.Users");
            DropForeignKey("dbo.Colleagues", "User2", "dbo.Users");
            DropForeignKey("dbo.Colleagues", "User1", "dbo.Users");
            DropIndex("dbo.UsersTasks", new[] { "TaskId" });
            DropIndex("dbo.UsersTasks", new[] { "Username" });
            DropIndex("dbo.UserManagerRequests", new[] { "User_Recieved" });
            DropIndex("dbo.UserManagerRequests", new[] { "User_Sent" });
            DropIndex("dbo.UserEmployeeRequests", new[] { "User_Recieved" });
            DropIndex("dbo.UserEmployeeRequests", new[] { "User_Sent" });
            DropIndex("dbo.UserColleagueRequests", new[] { "User_Recieved" });
            DropIndex("dbo.UserColleagueRequests", new[] { "User_Sent" });
            DropIndex("dbo.ManagersEmployees", new[] { "Employee" });
            DropIndex("dbo.ManagersEmployees", new[] { "Manager" });
            DropIndex("dbo.Colleagues", new[] { "User2" });
            DropIndex("dbo.Colleagues", new[] { "User1" });
            DropIndex("dbo.Tasks", new[] { "Creator_Username" });
            DropIndex("dbo.Comments", new[] { "Task_TaskId" });
            DropIndex("dbo.Comments", new[] { "Author_Username" });
            DropTable("dbo.UsersTasks");
            DropTable("dbo.UserManagerRequests");
            DropTable("dbo.UserEmployeeRequests");
            DropTable("dbo.UserColleagueRequests");
            DropTable("dbo.ManagersEmployees");
            DropTable("dbo.Colleagues");
            DropTable("dbo.Tasks");
            DropTable("dbo.Users");
            DropTable("dbo.Comments");
        }
    }
}
