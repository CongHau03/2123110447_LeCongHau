using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Demo2.Data;
using Demo2.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Demo2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VouchersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VouchersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Voucher>>> GetVouchers()
        {
            return await _context.Vouchers.ToListAsync();
        }

        [HttpGet("validate/{code}")]
        public async Task<ActionResult<Voucher>> ValidateVoucher(string code, [FromQuery] decimal amount)
        {
            var voucher = await _context.Vouchers
                .FirstOrDefaultAsync(v => v.Code == code && v.IsActive);

            if (voucher == null)
            {
                return NotFound("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
            }

            if (voucher.ExpiryDate.HasValue && voucher.ExpiryDate < System.DateTime.Now)
            {
                return BadRequest("Mã giảm giá đã hết hạn.");
            }

            if (amount < voucher.MinOrderAmount)
            {
                return BadRequest($"Đơn hàng tối thiểu phải từ {voucher.MinOrderAmount:N0}đ để áp dụng mã này.");
            }

            return Ok(voucher);
        }

        [HttpPost("use/{code}")]
        public async Task<IActionResult> UseVoucher(string code)
        {
            var voucher = await _context.Vouchers.FirstOrDefaultAsync(v => v.Code == code);
            if (voucher == null) return NotFound();

            voucher.IsActive = false;
            
            // Also update the UserReward if it exists
            var userReward = await _context.UserRewards.FirstOrDefaultAsync(ur => ur.GeneratedCode == code);
            if (userReward != null)
            {
                userReward.IsUsed = true;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<Voucher>> CreateVoucher(Voucher voucher)
        {
            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVouchers), new { id = voucher.Id }, voucher);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVoucher(int id)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null) return NotFound();

            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
