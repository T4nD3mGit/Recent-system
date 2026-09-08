using Microsoft.AspNetCore.Mvc;
using BarangaySchedulingAPI.Data;
using BarangaySchedulingAPI.Models;
using BarangaySchedulingAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace BarangaySchedulingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
private readonly AppDbContext _context;
private readonly EmailService _emailService;

public AppointmentsController(AppDbContext context, EmailService emailService)
{
    _context = context;
    _emailService = emailService;
}

        // ===========================
        // GET ALL APPOINTMENTS
        // ===========================
        [HttpGet]
        public IActionResult GetAppointments()
        {
            return Ok(_context.Appointments.ToList());
        }

        // ===========================
        // GET PENDING APPOINTMENTS
        // ===========================
        [HttpGet("pending")]
        public IActionResult GetPendingAppointments()
        {
            return Ok(
                _context.Appointments
                .Where(a => a.Status == "Pending")
                .ToList()
            );
        }

        // ===========================
        // GET APPROVED APPOINTMENTS
        // ===========================
        [HttpGet("approved")]
        public IActionResult GetApprovedAppointments()
        {
            return Ok(
                _context.Appointments
                .Where(a => a.Status == "Approved")
                .ToList()
            );
        }

        // ===========================
        // CREATE APPOINTMENT
        // ===========================
        [HttpPost]
        public async Task<IActionResult> Create(Appointment appointment)
        {
            appointment.Status = "Pending";

            // LIMIT 20 APPOINTMENTS PER DAY
            int dailyCount = _context.Appointments.Count(a =>
                a.AppointmentDate.Date == appointment.AppointmentDate.Date
            );

            if(dailyCount >= 20)
            {
                return BadRequest(new
                {
                    message = "This date is already full. Maximum 20 appointments per day."
                });
            }

            // LIMIT 2 APPOINTMENTS PER HOUR
            int hourlyCount = _context.Appointments.Count(a =>
                a.AppointmentDate.Date == appointment.AppointmentDate.Date &&
                a.AppointmentTime == appointment.AppointmentTime
            );

            if(hourlyCount >= 2)
            {
                return BadRequest(new
                {
                    message = "This time slot is already full."
                });
            }

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
await _emailService.SendEmailAsync(
    appointment.Email,
    "Appointment Received - Barangay Santol",
    $@"
    <h2>Appointment Received</h2>

    <p>Hello <b>{appointment.FullName}</b>,</p>

    <p>Your appointment has been successfully received.</p>

    <table border='1' cellpadding='8' cellspacing='0'>
        <tr>
            <td><b>Purpose</b></td>
            <td>{appointment.Purpose}</td>
        </tr>

        <tr>
            <td><b>Date</b></td>
            <td>{appointment.AppointmentDate:MMMM dd, yyyy}</td>
        </tr>

        <tr>
            <td><b>Time</b></td>
            <td>{appointment.AppointmentTime}</td>
        </tr>

        <tr>
            <td><b>Status</b></td>
            <td>Pending</td>
        </tr>
    </table>

    <br>

    <p>Please wait for another email once your appointment has been approved.</p>

    <br>

    <b>Barangay Santol Scheduling System</b>
    ");
            return Ok(new
            {
                message = "Appointment successfully submitted.",
                appointment
            });
        }

        // ===========================
        // APPROVE APPOINTMENT
        // ===========================
        // URL:
        // PUT api/Appointments/approve/5
        // ===========================
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if(appointment == null)
            {
                return NotFound(new
                {
                    message = "Appointment not found."
                });
            }

            appointment.Status = "Approved";

            await _context.SaveChangesAsync();
await _emailService.SendEmailAsync(
    appointment.Email,
    "Appointment Approved",
    $@"
    <h2>Appointment Approved</h2>

    <p>Hello <b>{appointment.FullName}</b>,</p>

    <p>Good news! Your appointment has been approved.</p>

    <table border='1' cellpadding='8' cellspacing='0'>
        <tr>
            <td><b>Purpose</b></td>
            <td>{appointment.Purpose}</td>
        </tr>

        <tr>
            <td><b>Date</b></td>
            <td>{appointment.AppointmentDate:MMMM dd, yyyy}</td>
        </tr>

        <tr>
            <td><b>Time</b></td>
            <td>{appointment.AppointmentTime}</td>
        </tr>

        <tr>
            <td><b>Status</b></td>
            <td>Approved</td>
        </tr>
    </table>

    <br>

    <p>Please arrive at least 10 minutes before your scheduled time.</p>

    <br>

    <b>Barangay Santol Scheduling System</b>
    ");
            return Ok(new
            {
                message = "Appointment approved successfully.",
                appointment
            });
        }

        // ===========================
        // CANCEL APPOINTMENT
        // ===========================
        // URL:
        // PUT api/Appointments/cancel/5
        // ===========================
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound(new
                {
                    message = "Appointment not found."
                });
            }

            // Soft-delete: Simply change status to Cancelled
            appointment.Status = "Cancelled";

            await _context.SaveChangesAsync();
await _emailService.SendEmailAsync(
    appointment.Email,
    "Appointment Cancelled",
    $@"
    <h2>Appointment Cancelled</h2>

    <p>Hello <b>{appointment.FullName}</b>,</p>

    <p>Your appointment has been cancelled.</p>

    <p>If you still need barangay services, you may schedule another appointment.</p>

    <br>

    <b>Barangay Santol Scheduling System</b>
    ");
            return Ok(new
            {
                message = "Appointment cancelled successfully.",
                appointment
            });
        }
// ===========================
// UPDATE APPOINTMENT STATUS
// ===========================
// URL:
// PUT api/Appointments/status/5
// Body:
// "Completed"
// or
// "Client Not Shown"
// ===========================
[HttpPut("status/{id}")]
public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
{
    var appointment = await _context.Appointments.FindAsync(id);

    if (appointment == null)
    {
        return NotFound(new
        {
            message = "Appointment not found."
        });
    }

    if (status != "Completed" &&
        status != "Client Not Shown")
    {
        return BadRequest(new
        {
            message = "Invalid status."
        });
    }

    appointment.Status = status;

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Status updated successfully.",
        appointment
    });
}
        // ===========================
        // DELETE APPOINTMENT
        // ===========================
        // URL:
        // DELETE api/Appointments/5
        // ===========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if(appointment == null)
            {
                return NotFound(new
                {
                    message = "Appointment not found."
                });
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Appointment deleted successfully."
            });
        }
    }
}