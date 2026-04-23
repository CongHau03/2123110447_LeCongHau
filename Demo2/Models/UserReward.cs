using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo2.Models
{
    public class UserReward
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int RewardId { get; set; }
        [ForeignKey("RewardId")]
        public Reward? Reward { get; set; }

        public DateTime RedeemedAt { get; set; } = DateTime.UtcNow;
        public string? GeneratedCode { get; set; }
        public bool IsUsed { get; set; } = false;
    }
}
