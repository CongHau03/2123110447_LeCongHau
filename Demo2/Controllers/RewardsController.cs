using Demo2.Data;
using Demo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System;
using System.Linq;

namespace Demo2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RewardsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RewardsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRewards()
        {
            return Ok(await _context.Rewards.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> AddReward([FromBody] Reward reward)
        {
            _context.Rewards.Add(reward);
            await _context.SaveChangesAsync();
            return Ok(reward);
        }

        [HttpPost("redeem")]
        public async Task<IActionResult> RedeemReward([FromBody] RedeemDto model)
        {
            try 
            {
                var user = await _context.Users.FindAsync(model.UserId);
                var reward = await _context.Rewards.FindAsync(model.RewardId);

                if (user == null) return NotFound("Không tìm thấy người dùng.");
                if (reward == null) return NotFound("Không tìm thấy quà tặng.");

                if (user.Points < reward.PointsRequired)
                    return BadRequest("Bạn không đủ điểm để đổi quà này.");

                user.Points -= reward.PointsRequired;
                
                // Generate random alphanumeric code
                string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                Random random = new Random();
                string randomCode = new string(Enumerable.Repeat(chars, 6)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                var userReward = new UserReward
                {
                    UserId = user.Id,
                    RewardId = reward.Id,
                    RedeemedAt = DateTime.UtcNow,
                    GeneratedCode = randomCode,
                    IsUsed = false
                };

                // Also add to global Voucher table for validation logic
                var rewardName = reward.Name?.Trim() ?? "";
                string discountType = "FixedAmount";
                decimal discountValue = 0;

                if (rewardName.Contains("%"))
                {
                    discountType = "Percentage";
                    if (rewardName.Contains("20")) discountValue = 20;
                    else if (rewardName.Contains("10")) discountValue = 10;
                    else discountValue = 5; // Default percentage
                }
                else
                {
                    discountType = "FixedAmount";
                    if (rewardName.Contains("200")) discountValue = 200000;
                    else if (rewardName.Contains("100")) discountValue = 100000;
                    else discountValue = 50000; // Default fixed amount
                }

                var voucher = new Voucher
                {
                    Code = randomCode,
                    DiscountType = discountType,
                    DiscountValue = discountValue,
                    IsActive = true,
                    MinOrderAmount = 0
                };

                _context.Vouchers.Add(voucher);
                _context.UserRewards.Add(userReward);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đổi quà thành công!", remainingPoints = user.Points, code = randomCode });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi máy chủ: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserRewards(int userId)
        {
            var userRewards = await _context.UserRewards
                .Include(ur => ur.Reward)
                .Where(ur => ur.UserId == userId)
                .OrderByDescending(ur => ur.RedeemedAt)
                .ToListAsync();
            return Ok(userRewards);
        }
    }

    public class RedeemDto
    {
        public int UserId { get; set; }
        public int RewardId { get; set; }
    }
}
