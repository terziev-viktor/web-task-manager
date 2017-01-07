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
                //context.Database.Log = Console.Write;
                var minkaTasks = context.Users.Find("Minka").Tasks.ToList();
                foreach (var item in minkaTasks)
                {
                    Console.WriteLine(item.Title + " " + item.Description + " " + item.Deadline);
                }

                context.SaveChanges();

            }

                
        }
    }
}
