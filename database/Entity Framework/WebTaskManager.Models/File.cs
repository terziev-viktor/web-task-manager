using System.ComponentModel.DataAnnotations;

namespace WebTaskManager.Models
{
    public class File
    {
        [Key]
        public int Id { get; set; }

        public string Fieldname { get; set; }

        public string OriginalName { get; set; }

        public string Encoding { get; set; }

        public string Mimetype { get; set; }

        public string Destination { get; set; }

        public string Filename { get; set; }

        public string Path { get; set; }

        public int Size { get; set; }
    }
}
