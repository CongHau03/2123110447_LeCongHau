USE AddHotelTables;
GO

IF OBJECT_ID('UserRewards', 'U') IS NOT NULL DROP TABLE UserRewards;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
IF OBJECT_ID('Rewards', 'U') IS NOT NULL DROP TABLE Rewards;
IF OBJECT_ID('SupportTickets', 'U') IS NOT NULL DROP TABLE SupportTickets;
IF OBJECT_ID('Rooms', 'U') IS NOT NULL DROP TABLE Rooms;
IF OBJECT_ID('Products', 'U') IS NOT NULL DROP TABLE Products;
IF OBJECT_ID('OrderDetails', 'U') IS NOT NULL DROP TABLE OrderDetails;
IF OBJECT_ID('Inventories', 'U') IS NOT NULL DROP TABLE Inventories;
IF OBJECT_ID('Dishes', 'U') IS NOT NULL DROP TABLE Dishes;
IF OBJECT_ID('Bookings', 'U') IS NOT NULL DROP TABLE Bookings;
GO

CREATE TABLE Bookings (
    BookingId INT IDENTITY(1,1) PRIMARY KEY,
    CheckIn DATETIME2 NOT NULL,
    CheckOut DATETIME2 NOT NULL,
    RoomId INT NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL
);

CREATE TABLE Dishes (
    DishId INT IDENTITY(1,1) PRIMARY KEY,
    Description NVARCHAR(MAX) NOT NULL,
    DishName NVARCHAR(MAX) NOT NULL,
    ImageUrl NVARCHAR(MAX) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(MAX) NOT NULL
);

CREATE TABLE Inventories (
    InventoryId INT IDENTITY(1,1) PRIMARY KEY,
    ItemName NVARCHAR(MAX) NOT NULL,
    Quantity FLOAT NOT NULL,
    Unit NVARCHAR(MAX) NOT NULL
);

CREATE TABLE OrderDetails (
    OrderDetailId INT IDENTITY(1,1) PRIMARY KEY,
    DishId INT NOT NULL,
    Note NVARCHAR(MAX) NOT NULL,
    OrderId INT NOT NULL,
    Quantity INT NOT NULL
);

CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Description NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(MAX) NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    StockQuantity INT NOT NULL
);

CREATE TABLE Rewards (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Description NVARCHAR(MAX) NOT NULL,
    Name NVARCHAR(MAX) NOT NULL,
    PointsRequired INT NOT NULL
);

CREATE TABLE Rooms (
    RoomId INT IDENTITY(1,1) PRIMARY KEY,
    Price DECIMAL(18,2) NOT NULL,
    RoomName NVARCHAR(MAX) NOT NULL,
    RoomType NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(MAX) NOT NULL
);

CREATE TABLE SupportTickets (
    TicketId INT IDENTITY(1,1) PRIMARY KEY,
    CreatedAt DATETIME2 NOT NULL,
    CustomerName NVARCHAR(MAX) NOT NULL,
    IssueDescription NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(MAX) NOT NULL
);

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(MAX) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Points INT NOT NULL,
    Role NVARCHAR(MAX) NOT NULL,
    Username NVARCHAR(MAX) NOT NULL
);

CREATE TABLE UserRewards (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RedeemedAt DATETIME2 NOT NULL,
    RewardId INT NOT NULL,
    UserId INT NOT NULL,
    CONSTRAINT FK_UserRewards_Rewards FOREIGN KEY (RewardId) REFERENCES Rewards(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRewards_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Seed Data
SET IDENTITY_INSERT Users ON;
INSERT INTO Users (Id, FullName, PasswordHash, Points, Role, Username)
VALUES (999, 'System Administrator', 'admin123', 0, 'Admin', 'admin');
SET IDENTITY_INSERT Users OFF;
GO
