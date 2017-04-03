namespace WebTaskManager.Data
{
    using Models;
    using System.Data.Entity;

    public class WebTaskManagerDb : DbContext
    {
        public WebTaskManagerDb()
            : base("name=WebTaskManagerDb")
        {
        }

        public virtual DbSet<Task> Tasks { get; set; }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<Comment> Comments { get; set; }

        public virtual DbSet<Login> Logins { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasMany(x => x.Managers).WithMany(x => x.Employees)
                .Map(x => 
                {
                    x.MapLeftKey("Manager");
                    x.MapRightKey("Employee");
                    x.ToTable("ManagersEmployees");
                });

            modelBuilder.Entity<User>().HasMany(x => x.Colleagues).WithMany()
                .Map(x =>
                {
                    x.MapLeftKey("User1");
                    x.MapRightKey("User2");
                    x.ToTable("Colleagues");
                });

            modelBuilder.Entity<User>().HasMany(x => x.SentColleagueRequests).WithMany(x => x.RecievedColleagueRequests)
                .Map(x =>
                {
                    x.MapLeftKey("User_Sent");
                    x.MapRightKey("User_Recieved");
                    x.ToTable("UserColleagueRequests");
                });

            modelBuilder.Entity<User>().HasMany(u => u.SentEmployeeRequests).WithMany(x => x.RecievedEmployeeRequests)
                .Map(x =>
                {
                    x.MapLeftKey("User_Sent");
                    x.MapRightKey("User_Recieved");
                    x.ToTable("UserEmployeeRequests");
                });

            modelBuilder.Entity<User>().HasMany(u => u.SentManagerRequests).WithMany(x => x.RecievedManagerRequests)
                .Map(x =>
                {
                    x.MapLeftKey("User_Sent");
                    x.MapRightKey("User_Recieved");
                    x.ToTable("UserManagerRequests");
                });

            modelBuilder.Entity<User>()
                .HasMany(u => u.Tasks)
                .WithMany(t => t.AssignedTo)
                .Map(ut => 
                {
                    ut.MapLeftKey("Username");
                    ut.MapRightKey("TaskId");
                    ut.ToTable("UsersTasks");
                });

            modelBuilder.Entity<Task>()
                .HasRequired<User>(x => x.Creator)
                .WithMany(x => x.CreatedTasks)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Comment>()
                 .HasRequired<User>(x => x.Author)
                 .WithMany(x => x.WritedComments)
                 .WillCascadeOnDelete(false);

            modelBuilder.Entity<Comment>()
                .HasRequired<Task>(x => x.Task)
                .WithMany(x => x.Comments);
                
        }
    }
}