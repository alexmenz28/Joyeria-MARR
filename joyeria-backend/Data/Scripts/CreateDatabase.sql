-- Crear la base de datos
CREATE DATABASE JoyeriaDB;
GO

USE JoyeriaDB;
GO

-- Crear tabla de Usuarios
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL,
    Apellido NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Rol NVARCHAR(20) NOT NULL CHECK (Rol IN ('Admin', 'Empleado', 'Cliente')),
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Activo BIT NOT NULL DEFAULT 1
);
GO

-- Crear tabla de Productos
CREATE TABLE Productos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(MAX) NOT NULL,
    Precio DECIMAL(18,2) NOT NULL,
    ImagenUrl NVARCHAR(MAX),
    Categoria NVARCHAR(50) NOT NULL,
    Material NVARCHAR(50),
    Peso NVARCHAR(20),
    Disponible BIT NOT NULL DEFAULT 1,
    Stock INT NOT NULL DEFAULT 0,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- Crear tabla de Pedidos
CREATE TABLE Pedidos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioId INT NOT NULL,
    FechaPedido DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    Estado NVARCHAR(20) NOT NULL CHECK (Estado IN ('Pendiente', 'En Proceso', 'Completado', 'Cancelado')),
    Notas NVARCHAR(MAX),
    Total DECIMAL(18,2) NOT NULL DEFAULT 0,
    CONSTRAINT FK_Pedidos_Usuarios FOREIGN KEY (UsuarioId) 
        REFERENCES Usuarios(Id) ON DELETE NO ACTION
);
GO

-- Crear tabla de DetallesPedido
CREATE TABLE DetallesPedido (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PedidoId INT NOT NULL,
    ProductoId INT,
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(18,2) NOT NULL,
    DescripcionPersonalizada NVARCHAR(MAX),
    CONSTRAINT FK_DetallesPedido_Pedidos FOREIGN KEY (PedidoId) 
        REFERENCES Pedidos(Id) ON DELETE CASCADE,
    CONSTRAINT FK_DetallesPedido_Productos FOREIGN KEY (ProductoId) 
        REFERENCES Productos(Id) ON DELETE SET NULL
);
GO

-- Crear índices para mejorar el rendimiento
CREATE INDEX IX_Usuarios_Email ON Usuarios(Email);
CREATE INDEX IX_Productos_Categoria ON Productos(Categoria);
CREATE INDEX IX_Pedidos_UsuarioId ON Pedidos(UsuarioId);
CREATE INDEX IX_Pedidos_Estado ON Pedidos(Estado);
CREATE INDEX IX_DetallesPedido_PedidoId ON DetallesPedido(PedidoId);
GO

-- Insertar datos iniciales para el administrador
INSERT INTO Usuarios (Nombre, Apellido, Email, PasswordHash, Rol, FechaCreacion, Activo)
VALUES (
    'Admin',
    'Sistema',
    'admin@joyeriamarr.com',
    -- Contraseña: Admin123! (hasheada con BCrypt)
    '$2a$11$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBAQHxK5J5J5J5',
    'Admin',
    GETUTCDATE(),
    1
);
GO

-- Insertar algunas categorías de productos
INSERT INTO Productos (Nombre, Descripcion, Precio, Categoria, Material, Disponible, Stock)
VALUES 
('Anillo de Compromiso', 'Anillo de compromiso en oro blanco con diamante central', 1500.00, 'Anillos', 'Oro Blanco', 1, 5),
('Collar de Perlas', 'Collar de perlas naturales con broche de oro', 800.00, 'Collares', 'Perlas', 1, 3),
('Pendientes de Diamantes', 'Pendientes de diamantes con montura de platino', 1200.00, 'Pendientes', 'Platino', 1, 4);
GO 