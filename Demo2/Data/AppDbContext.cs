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
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Reward> Rewards { get; set; }
        public DbSet<UserReward> UserRewards { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Voucher> Vouchers { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Admin account
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 999,
                Username = "admin",
                PasswordHash = "admin123", // Using plain text as the current system does
                FullName = "System Administrator",
                Role = "Admin",
                Points = 0
            });

            modelBuilder.Entity<Voucher>().HasData(
                new Voucher { Id = 1, Code = "GIAM20", DiscountType = "Percentage", DiscountValue = 20, IsActive = true },
                new Voucher { Id = 2, Code = "HOTEL100", DiscountType = "FixedAmount", DiscountValue = 100000, IsActive = true, MinOrderAmount = 500000 }
            );

            modelBuilder.Entity<Reward>().HasData(
                new Reward { Id = 1, Name = "Vé giảm 20%", Description = "Giảm giá 20% cho mọi dịch vụ", PointsRequired = 500, VoucherCode = "GIAM20" },
                new Reward { Id = 2, Name = "Vé giảm 10 %", Description = "Giảm giá 10% cho mọi dịch vụ", PointsRequired = 250, VoucherCode = "GIAM10" },
                new Reward { Id = 3, Name = "Vé Giảm Giá 200k", Description = "Giảm ngay 200.000đ", PointsRequired = 300, VoucherCode = "HOTEL200" }
            );
        }
    }
}
