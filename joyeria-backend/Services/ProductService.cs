using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace JoyeriaBackend.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly Cloudinary _cloudinary;
    private readonly IConfiguration _configuration;

    public ProductService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;

        var cloudinarySettings = _configuration.GetSection("CloudinarySettings");
        var account = new Account(
            cloudinarySettings["CloudName"] ?? throw new ArgumentNullException("CloudName"),
            cloudinarySettings["ApiKey"] ?? throw new ArgumentNullException("ApiKey"),
            cloudinarySettings["ApiSecret"] ?? throw new ArgumentNullException("ApiSecret"));
        _cloudinary = new Cloudinary(account);
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.MaterialEntity)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<PagedResult<Product>> GetPagedAsync(ProductListQuery q)
    {
        var pageSize = Math.Clamp(q.PageSize, 1, 100);
        var baseQuery = _context.Products
            .Include(p => p.Category)
            .Include(p => p.MaterialEntity)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.Category))
        {
            var cat = q.Category.Trim();
            baseQuery = baseQuery.Where(p => p.Category.Name == cat);
        }

        if (!string.IsNullOrWhiteSpace(q.Material))
        {
            var mat = q.Material.Trim();
            baseQuery = baseQuery.Where(p => p.MaterialEntity != null && p.MaterialEntity.Name == mat);
        }

        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.Trim();
            baseQuery = baseQuery.Where(p =>
                p.Name.Contains(s) ||
                p.Description.Contains(s) ||
                p.Category.Name.Contains(s) ||
                (p.MaterialEntity != null && p.MaterialEntity.Name.Contains(s)));
        }

        if (q.MinPrice.HasValue)
            baseQuery = baseQuery.Where(p => p.Price >= q.MinPrice.Value);

        if (q.MaxPrice.HasValue)
            baseQuery = baseQuery.Where(p => p.Price <= q.MaxPrice.Value);

        if (q.InStockOnly == true)
            baseQuery = baseQuery.Where(p => p.IsAvailable || p.Stock > 0);

        var totalCount = await baseQuery.CountAsync();

        var totalPages = Math.Max(1, (int)Math.Ceiling(totalCount / (double)pageSize));
        var page = Math.Clamp(q.Page < 1 ? 1 : q.Page, 1, totalPages);
        if (totalCount == 0)
            page = 1;

        var sort = (q.SortBy ?? "relevance").ToLowerInvariant();
        IOrderedQueryable<Product> ordered = sort switch
        {
            "price-asc" => baseQuery.OrderBy(p => p.Price),
            "price-desc" => baseQuery.OrderByDescending(p => p.Price),
            "name-asc" => baseQuery.OrderBy(p => p.Name),
            "name-desc" => baseQuery.OrderByDescending(p => p.Name),
            "newest" => baseQuery.OrderByDescending(p => p.CreatedAt),
            _ => baseQuery.OrderBy(p => p.Id),
        };

        var items = await ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Product>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<int?> GetCategoryIdByNameAsync(string name)
    {
        var cat = await _context.Categories.FirstOrDefaultAsync(c => c.Name == name);
        return cat?.Id;
    }

    public async Task<bool> MaterialExistsAsync(int id) =>
        await _context.Materials.AnyAsync(m => m.Id == id);

    public async Task<IEnumerable<Product>> GetByCategoryNameAsync(string categoryName)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.MaterialEntity)
            .Where(p => p.Category.Name == categoryName)
            .ToListAsync();
    }

    public async Task<Product> CreateAsync(Product product, IFormFile? imagen)
    {
        if (imagen != null)
            product.ImageUrl = await UploadImageAsync(imagen);

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return await GetByIdAsync(product.Id) ?? product;
    }

    public async Task<Product> UpdateAsync(Product product, IFormFile? imagen = null)
    {
        var existing = await _context.Products.FindAsync(product.Id);
        if (existing == null)
            throw new KeyNotFoundException($"Product with ID {product.Id} not found.");

        existing.Name = product.Name;
        existing.Description = product.Description;
        existing.Price = product.Price;
        existing.CategoryId = product.CategoryId;
        existing.MaterialId = product.MaterialId;
        existing.Weight = product.Weight;
        existing.IsAvailable = product.IsAvailable;
        existing.Stock = product.Stock;
        existing.UpdatedAt = DateTime.UtcNow;

        if (imagen != null)
            existing.ImageUrl = await UploadImageAsync(imagen);

        await _context.SaveChangesAsync();
        return await GetByIdAsync(existing.Id) ?? existing;
    }

    public async Task DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product != null)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<string> UploadImageAsync(IFormFile imagen)
    {
        if (imagen == null || imagen.Length == 0)
            throw new ArgumentException("Image cannot be null or empty.");

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
