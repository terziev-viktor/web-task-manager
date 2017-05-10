using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebTaskManager.Models
{
    public class User
    {
        public User()
        {
            this.Tasks = new List<Task>();
            this.Employees = new List<User>();
        }

        [Key]
        public string Username { get; set; }

        public string FullName { get; set; }

        public string Password { get; set; }

        public virtual File Avatar { get; set; }

        public virtual ICollection<User> RecievedEmployeeRequests { get; set; }
        
        public virtual ICollection<User> RecievedManagerRequests { get; set; }

        [InverseProperty("RecievedManagerRequests")]
        public virtual ICollection<User> SentManagerRequests { get; set; }

        [InverseProperty("RecievedEmployeeRequests")]
        public virtual ICollection<User> SentEmployeeRequests { get; set; }

        public virtual ICollection<User> Managers { get; set; }

        [InverseProperty("AssignedTo")]
        public virtual ICollection<Task> Tasks { get; set; }
        
        public virtual ICollection<User> Employees { get; set; }

        [InverseProperty("Creator")]
        public virtual ICollection<Task> CreatedTasks { get; set; }

        public virtual ICollection<Comment> WritedComments { get; set; }

        public virtual ICollection<User> Colleagues { get; set; }

        public virtual ICollection<User> SentColleagueRequests { get; set; }

        public virtual ICollection<User> RecievedColleagueRequests { get; set; }
        

    }
}
