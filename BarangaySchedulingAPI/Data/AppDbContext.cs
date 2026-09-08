using Microsoft.EntityFrameworkCore;
using BarangaySchedulingAPI.Models;

namespace BarangaySchedulingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
    }
}