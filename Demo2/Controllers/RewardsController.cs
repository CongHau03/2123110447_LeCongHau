using Demo2.Data;
using Demo2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var user = await _context.Users.FindAsync(model.UserId);
            var reward = await _context.Rewards.FindAsync(model.RewardId);

            if (user == null || reward == null) return NotFound("User or Reward not found");

            if (user.Points < reward.PointsRequired)
                return BadRequest("Not enough points");

            user.Points -= reward.PointsRequired;
            
            var userReward = new UserReward
            {
                UserId = user.Id,
                RewardId = reward.Id,
                RedeemedAt = DateTime.UtcNow
            };

            _context.UserRewards.Add(userReward);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reward redeemed successfully!", remainingPoints = user.Points });
        }
    }

    public class RedeemDto
    {
        public int UserId { get; set; }
        public int RewardId { get; set; }
    }
}
