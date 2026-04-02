namespace Demo2.Models
{
    public class Dish
    {
        public int DishId { get; set; } // Mã món 
        public string DishName { get; set; } // Tên món 
        public decimal Price { get; set; } // Đơn giá 
        public string Description { get; set; } // Mô tả 
        public string ImageUrl { get; set; } // Hình ảnh 
        public string Status { get; set; } // Trạng thái: Còn hàng/Hết hàng 
    }
}
