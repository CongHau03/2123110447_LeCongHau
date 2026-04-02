namespace Demo2.Models
{
        public class Room
        {
            public int RoomId { get; set; } // [cite: 45]
            public string RoomName { get; set; }
            public string RoomType { get; set; }
            public decimal Price { get; set; } // [cite: 45]
            public string Status { get; set; } // Trống, Đang ở, Đang dọn [cite: 45]
        }
    
}
