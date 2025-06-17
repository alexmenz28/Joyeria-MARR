using JoyeriaBackend.Models;
using Microsoft.AspNetCore.Http;

namespace JoyeriaBackend.Services
{
    public interface IProductoService
    {
        Task<Producto> GetByIdAsync(int id);
        Task<IEnumerable<Producto>> GetAllAsync();
        Task<IEnumerable<Producto>> GetByCategoriaAsync(string categoria);
        Task<Producto> CreateAsync(Producto producto, IFormFile imagen);
        Task<Producto> UpdateAsync(Producto producto, IFormFile imagen = null);
        Task DeleteAsync(int id);
        Task<string> UploadImageAsync(IFormFile imagen);
    }
} 