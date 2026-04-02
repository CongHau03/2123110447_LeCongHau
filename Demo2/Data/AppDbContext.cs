using Demo2.Models;
using Microsoft.EntityFrameworkCore;

namespace Demo2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Room> Rooms { get; set; } // Tạo bảng Room [cite: 45]
        public DbSet<Booking> Bookings { get; set; } // Tạo bảng Booking [cite: 46]
        public DbSet<Dish> Dishes { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
    }
}
