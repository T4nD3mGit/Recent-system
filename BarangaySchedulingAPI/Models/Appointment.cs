namespace BarangaySchedulingAPI.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string ContactNumber { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Purpose { get; set; } = string.Empty;

        public DateTime AppointmentDate { get; set; }

        public string AppointmentTime { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";
    }
}