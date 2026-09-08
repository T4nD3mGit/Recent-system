using System;

namespace BarangaySchedulingAPI.Models
{
    public class Complaint
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public string Purpose { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        
        // This 'CreatedAt' tracks the date/time the complaint was made
        // and is what your calendar will read to display the complaint on that day.
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}