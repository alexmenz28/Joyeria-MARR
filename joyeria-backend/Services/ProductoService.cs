using JoyeriaBackend.Data;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace JoyeriaBackend.Services
{
    public class ProductoService : IProductoService
    {
        private readonly ApplicationDbContext _context;
        private readonly Cloudinary _cloudinary;
        private readonly IConfiguration _configuration;

        public ProductoService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

            // Initialize Cloudinary
            var cloudinarySettings = _configuration.GetSection("CloudinarySettings");
            var account = new Account(
                cloudinarySettings["CloudName"] ?? throw new ArgumentNullException("CloudName"),
                cloudinarySettings["ApiKey"] ?? throw new ArgumentNullException("ApiKey"),
                cloudinarySettings["ApiSecret"] ?? throw new ArgumentNullException("ApiSecret"));
            _cloudinary = new Cloudinary(account);
        }

        public async Task<Producto?> GetByIdAsync(int id)
        {
            return await _context.Productos.FindAsync(id);
        }

        public async Task<IEnumerable<Producto>> GetAllAsync()
        {
            return await _context.Productos.ToListAsync();
        }

        public async Task<IEnumerable<Producto>> GetByCategoriaAsync(string categoria)
        {
            return await _context.Productos.Where(p => p.Categoria == categoria).ToListAsync();
        }

        public async Task<Producto> CreateAsync(Producto producto, IFormFile? imagen)
        {
            if (imagen != null)
            {
                producto.ImagenUrl = await UploadImageAsync(imagen);
            }
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
            return producto;
        }

        public async Task<Producto> UpdateAsync(Producto producto, IFormFile? imagen = null)
        {
            var productoExistente = await _context.Productos.FindAsync(producto.Id);
            if (productoExistente == null)
            {
                throw new KeyNotFoundException($"Producto con ID {producto.Id} no encontrado.");
            }

            // Copiar las propiedades actualizables del producto entrante al producto existente
            productoExistente.Nombre = producto.Nombre;
            productoExistente.Descripcion = producto.Descripcion;
            productoExistente.Precio = producto.Precio;
            productoExistente.Categoria = producto.Categoria;
            productoExistente.Material = producto.Material;
            productoExistente.Peso = producto.Peso;
            productoExistente.Disponible = producto.Disponible;
            productoExistente.Stock = producto.Stock;
            productoExistente.FechaActualizacion = DateTime.UtcNow; // Actualizar la fecha de modificación

            // **SOLO** actualizar la ImagenUrl si se proporciona un nuevo archivo de imagen
            if (imagen != null)
            {
                productoExistente.ImagenUrl = await UploadImageAsync(imagen);
            }
            // Si 'imagen' es null, simplemente NO hacemos nada con productoExistente.ImagenUrl,
            // lo que permite que Entity Framework Core conserve el valor existente en la base de datos.

            await _context.SaveChangesAsync();
            return productoExistente;
        }

        public async Task DeleteAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto != null)
            {
                _context.Productos.Remove(producto);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<string> UploadImageAsync(IFormFile imagen)
        {
            if (imagen == null || imagen.Length == 0)
            {
                throw new ArgumentException("La imagen no puede ser nula o vacía.");
            }

            var uploadResult = new ImageUploadResult();
            using (var stream = imagen.OpenReadStream())
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(imagen.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult.Url.ToString();
        }
    }
} 