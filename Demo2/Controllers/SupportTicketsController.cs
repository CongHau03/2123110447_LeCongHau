using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Demo2.Data;
using Demo2.Models;

namespace Demo2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportTicketsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SupportTicketsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupportTicket>>> GetSupportTickets()
        {
            return await _context.SupportTickets.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<SupportTicket>> PostSupportTicket(SupportTicket ticket)
        {
            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();
            return Ok(ticket);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            if (ticket == null) return NotFound();

            ticket.Status = status;
            await _context.SaveChangesAsync();
            return Ok(ticket);
        }
    }
}
