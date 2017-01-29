using System;
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
                context.Database.Initialize(true);
            }
        }
    }
}
