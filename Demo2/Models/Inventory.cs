namespace Demo2.Models
{
    public class Inventory
    {
        public int InventoryId { get; set; } // Mã nguyên liệu 
        public string ItemName { get; set; } // Tên nguyên liệu 
        public string Unit { get; set; } // Đơn vị tính (g, kg, l) 
        public double Quantity { get; set; } // Số lượng tồn 
    }
}
