using Microsoft.AspNetCore.Mvc;
using BarangaySchedulingAPI.Services;

namespace BarangaySchedulingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("test")]
        public async Task<IActionResult> Test()
        {
            await _emailService.SendEmailAsync(
                "jonmarkce@gmail.com",
                "Barangay Santol Test",
                "<h2>Email is working!</h2><p>Your Gmail SMTP is successfully configured.</p>");

            return Ok("Email Sent Successfully!");
        }
    }
}