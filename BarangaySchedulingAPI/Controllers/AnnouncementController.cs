using Microsoft.AspNetCore.Mvc;
using BarangaySchedulingAPI.Data;
using BarangaySchedulingAPI.Models;

namespace BarangaySchedulingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnnouncementController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Announcement
        [HttpGet]
        public IActionResult GetAnnouncements()
        {
            var announcements = _context.Announcements
                .OrderByDescending(a => a.CreatedAt)
                .ToList();

            return Ok(announcements);
        }

        // POST: api/Announcement
        [HttpPost]
        public async Task<IActionResult> CreateAnnouncement([FromBody] Announcement announcement)
        {
            announcement.CreatedAt = DateTime.Now;

            _context.Announcements.Add(announcement);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Announcement published successfully.",
                announcement
            });
        }
    }
}