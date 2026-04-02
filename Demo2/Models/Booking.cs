namespace Demo2.Models
{
    public class Booking
    {
        public int BookingId { get; set; } // [cite: 46]
        public int RoomId { get; set; }
        public DateTime CheckIn { get; set; } // [cite: 46]
        public DateTime CheckOut { get; set; }
        public decimal TotalPrice { get; set; } // [cite: 46]
    }
}
