using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using BarangaySchedulingAPI.Models;

namespace BarangaySchedulingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult Login(LoginModel model)
        {
            string connectionString =
                _configuration.GetConnectionString("DefaultConnection");

            using SqlConnection conn = new SqlConnection(connectionString);

            conn.Open();

            string query =
                @"SELECT COUNT(*) FROM Admins
                  WHERE Username=@Username
                  AND Password=@Password";

            SqlCommand cmd = new SqlCommand(query, conn);

            cmd.Parameters.AddWithValue("@Username", model.Username);
            cmd.Parameters.AddWithValue("@Password", model.Password);

            int count = (int)cmd.ExecuteScalar();

            if (count > 0)
            {
                return Ok(new { success = true });
            }

            return Unauthorized(new
            {
                success = false,
                message = "Invalid username or password."
            });
        }
    }
}