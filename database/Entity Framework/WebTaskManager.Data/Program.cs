using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using WebTaskManager.Models;

namespace WebTaskManager.Data
{
    class Program
    {
        static void Main(string[] args)
        {
            using (WebTaskManagerDb context = new WebTaskManagerDb())
            {
                context.Database.Log = Console.Write;

                context.Comments.Add(new Comment()
                {
                    Content = "Very nice task",
                    Author = context.Users.Find("MITKO"),
                    Date = DateTime.Now,
                    Task = new Task()
                    {
                        Title = "Go",
                        Description = "To the church",
                        Creator = context.Users.Find("Yordan"),
                        Deadline = new DateTime(2017, 3, 11),
                        IsDone = false,
                        Priority = Models.Enums.TaskPriority.LOW,
                        Repeatability = Models.Enums.TaskRepeatability.WEEKLY,
                        Progress = 20
                    }
                });

                context.SaveChanges();
            }
        }
    }
}
