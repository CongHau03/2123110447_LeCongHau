namespace Demo2.Models
{
    public class OrderDetail
    {
        public int OrderDetailId { get; set; }
        public int OrderId { get; set; } // Mã đơn 
        public int DishId { get; set; } // Mã món 
        public int Quantity { get; set; } // Số lượng 
        public string Note { get; set; } // Ghi chú (Ví dụ: không hành) 
    }
}
