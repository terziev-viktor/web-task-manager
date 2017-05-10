using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using WebTaskManager.Models.Enums;

namespace WebTaskManager.Models
{
    public class Task
    {
        public Task()
        {
            this.AssignedTo = new List<User>();
            this.Files = new List<File>();
        }
        [Key]
        public int TaskId { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public virtual ICollection<File> Files { get; set; }

        public DateTime? Deadline { get; set; }
        
        public bool IsDone { get; set; }

        public bool IsArchived { get; set; }

        public TaskPriority  Priority { get; set; }
        
        public int Progress { get; set; }

        public TaskRepeatability Repeatability { get; set; }

        public virtual ICollection<User> AssignedTo { get; set; }

        public virtual User Creator { get; set; }

        public virtual ICollection<Comment> Comments { get; set; }
    }
}
