using System;
using System.ComponentModel.DataAnnotations;

namespace Demo2.Models
{
    public class SupportTicket
    {
        [Key]
        public int TicketId { get; set; }
        
        public string CustomerName { get; set; }
        
        public string IssueDescription { get; set; }
        
        public string Status { get; set; } = "Mở"; // Mở, Đang xử lý, Đã đóng
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
