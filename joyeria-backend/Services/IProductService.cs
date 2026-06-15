using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;
using Microsoft.AspNetCore.Http;

namespace JoyeriaBackend.Services;

public interface IProductService
{
    Task<ProductDto?> GetByIdAsync(int id);
    Task<PagedResult<ProductDto>> GetPagedAsync(ProductListQuery query);
    Task<PagedResult<ProductDto>> GetByCategoryNamePagedAsync(string categoryName, PagedQuery query);
    Task<int?> GetCategoryIdByNameAsync(string name);
    Task<bool> MaterialExistsAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto> UpdateAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteAsync(int id);
}
