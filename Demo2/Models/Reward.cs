using System.ComponentModel.DataAnnotations;

namespace Demo2.Models
{
    public class Reward
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int PointsRequired { get; set; }
    }
}
