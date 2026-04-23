using System;
using System.ComponentModel.DataAnnotations;

namespace Demo2.Models
{
    public class Voucher
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; }

        [Required]
        public string DiscountType { get; set; } // "Percentage" or "FixedAmount"

        [Required]
        public decimal DiscountValue { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public bool IsActive { get; set; } = true;

        public decimal MinOrderAmount { get; set; } = 0;
    }
}
