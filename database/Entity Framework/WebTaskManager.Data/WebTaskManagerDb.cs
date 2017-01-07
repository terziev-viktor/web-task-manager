namespace WebTaskManager.Data
{
    using Models;
    using System.Data.Entity;

    public class WebTaskManagerDb : DbContext
    {
        // Your context has been configured to use a 'WebTaskManagerDb' connection string from your application's 
        // configuration file (App.config or Web.config). By default, this connection string targets the 
        // 'WebTaskManager.Data.WebTaskManagerDb' database on your LocalDb instance. 
        // 
        // If you wish to target a different database and/or database provider, modify the 'WebTaskManagerDb' 
        // connection string in the application configuration file.
        public WebTaskManagerDb()
            : base("name=WebTaskManagerDb")
        {
        }

        public virtual DbSet<Task> Tasks { get; set; }

        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasMany(x => x.Employees).WithMany()
                .Map(x =>
                {
                    x.MapLeftKey("Username");
                    x.MapRightKey("Employee");
                    x.ToTable("UserEmployees");
                });

            modelBuilder.Entity<User>().HasMany(x => x.Managers).WithMany()
                .Map(x => 
                {
                    x.MapLeftKey("Username");
                    x.MapRightKey("Manager");
                    x.ToTable("UserManagers");
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

        }
    }

    //public class MyEntity
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //}
}