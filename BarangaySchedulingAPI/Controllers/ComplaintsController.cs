using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BarangaySchedulingAPI.Data;
using BarangaySchedulingAPI.Models;
using System;
using System.Threading.Tasks;

namespace BarangaySchedulingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ComplaintsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Complaints
        [HttpGet]
        public async Task<IActionResult> GetComplaints()
        {
            var complaints = await _context.Complaints.ToListAsync();
            return Ok(complaints);
        }

        // POST: api/Complaints
        [HttpPost]
        public async Task<IActionResult> CreateComplaint([FromBody] Complaint complaint)
        {
            if (complaint == null)
            {
                return BadRequest("Complaint data is null.");
            }

            // Automatically timestamp the complaint when it is received
            if (complaint.CreatedAt == default)
            {
                complaint.CreatedAt = DateTime.Now;
            }

            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComplaints), new { id = complaint.Id }, complaint);
        }
    }
}