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
            if (imagen != null)
            {
                producto.ImagenUrl = await UploadImageAsync(imagen);
            }
            _context.Entry(producto).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return producto;
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