using Demo2.Data;
using Demo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Demo2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Select(u => new { 
                u.Id, u.Username, u.FullName, u.Role, u.Points 
            }).ToListAsync();
            return Ok(users);
        }

        [HttpPost("{id}/add-points")]
        public async Task<IActionResult> AddPoints(int id, [FromBody] int points)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            
            user.Points += points;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Points added", newTotal = user.Points });
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            
            user.Role = role;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Role updated", role = user.Role });
        }
    }
}
