using System.ComponentModel.DataAnnotations;

namespace BarangaySchedulingAPI.Models
{
    public class Announcement
    {
        [Key]
        public int AnnouncementId { get; set; }

        [Required]
        public string Title { get; set; } = "";

        public string Description { get; set; } = "";

        public string Category { get; set; } = "";

        public DateTime EventDate { get; set; }

        public TimeSpan EventTime { get; set; }

        public string Location { get; set; } = "";

        public string? ImagePath { get; set; }

        public bool IsPinned { get; set; }

        public string Status { get; set; } = "Published";

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}