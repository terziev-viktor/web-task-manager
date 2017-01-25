using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebTaskManager.Models
{
    public class Comment
    {
        public int CommentId { get; set; }

        public virtual User Author { get; set; }

        public DateTime Date { get; set; }

        public string Content { get; set; }

        public virtual Task Task { get; set; }
    }
}
