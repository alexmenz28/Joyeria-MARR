using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;
using Microsoft.AspNetCore.Http;

namespace JoyeriaBackend.Services;

public interface IProductService
{
    Task<Product?> GetByIdAsync(int id);
    Task<PagedResult<Product>> GetPagedAsync(ProductListQuery query);
    Task<IEnumerable<Product>> GetByCategoryNameAsync(string categoryName);
    Task<int?> GetCategoryIdByNameAsync(string name);
    Task<bool> MaterialExistsAsync(int id);
    Task<Product> CreateAsync(Product product, IFormFile? imagen);
    Task<Product> UpdateAsync(Product product, IFormFile? imagen = null);
    Task DeleteAsync(int id);
    Task<string> UploadImageAsync(IFormFile imagen);
}
