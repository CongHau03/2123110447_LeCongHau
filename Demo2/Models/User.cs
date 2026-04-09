using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Demo2.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // "Admin", "Staff", "Customer"
        public string FullName { get; set; }
        public int Points { get; set; } = 0; // For customers
        
        [JsonIgnore]
        public ICollection<UserReward>? UserRewards { get; set; }
    }
}
