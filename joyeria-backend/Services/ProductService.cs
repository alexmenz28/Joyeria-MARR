using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Mapping;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace JoyeriaBackend.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly Cloudinary _cloudinary;
    private readonly IFileValidationService _fileValidation;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IFileValidationService fileValidation,
        ILogger<ProductService> logger)
    {
        _context = context;
        _fileValidation = fileValidation;
        _logger = logger;

        var cloudinarySettings = configuration.GetSection("CloudinarySettings");
        var account = new Account(
            cloudinarySettings["CloudName"] ?? throw new ArgumentNullException("CloudName"),
            cloudinarySettings["ApiKey"] ?? throw new ArgumentNullException("ApiKey"),
            cloudinarySettings["ApiSecret"] ?? throw new ArgumentNullException("ApiSecret"));
        _cloudinary = new Cloudinary(account);
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await QueryWithIncludes().FirstOrDefaultAsync(p => p.Id == id);
        return product?.ToDto();
    }

    public async Task<PagedResult<ProductDto>> GetPagedAsync(ProductListQuery q) =>
        await BuildPagedQuery(q);

    public async Task<PagedResult<ProductDto>> GetByCategoryNamePagedAsync(string categoryName, PagedQuery query)
    {
        var listQuery = new ProductListQuery
        {
            Category = categoryName,
            Page = query.Page,
            PageSize = query.PageSize,
        };
        return await BuildPagedQuery(listQuery);
    }

    public async Task<int?> GetCategoryIdByNameAsync(string name)
    {
        var cat = await _context.Categories.FirstOrDefaultAsync(c => c.Name == name);
        return cat?.Id;
    }

    public async Task<bool> MaterialExistsAsync(int id) =>
        await _context.Materials.AnyAsync(m => m.Id == id);

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        _fileValidation.ValidateImage(dto.Imagen);

        var categoryId = await GetCategoryIdByNameAsync(dto.Category)
            ?? throw new ArgumentException("Invalid category.");

        if (dto.MaterialId.HasValue && dto.MaterialId > 0 && !await MaterialExistsAsync(dto.MaterialId.Value))
            throw new ArgumentException("Invalid material.");

        var imageUrl = await UploadImageAsync(dto.Imagen);
        var now = DateTime.UtcNow;

        var product = new Product
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            Price = dto.Price,
            CategoryId = categoryId,
            MaterialId = dto.MaterialId is > 0 ? dto.MaterialId : null,
            Weight = string.IsNullOrWhiteSpace(dto.Weight) ? null : dto.Weight.Trim(),
            IsAvailable = dto.IsAvailable,
            Stock = dto.Stock,
            ImageUrl = imageUrl,
            CreatedAt = now,
            UpdatedAt = now,
            Images = new List<ProductImage>
            {
                new() { Url = imageUrl, SortOrder = 0 },
            },
        };

        var sortOrder = 1;
        if (dto.Imagenes != null)
        {
            foreach (var extra in dto.Imagenes.Where(f => f.Length > 0))
            {
                _fileValidation.ValidateImage(extra);
                var url = await UploadImageAsync(extra);
                product.Images.Add(new ProductImage { Url = url, SortOrder = sortOrder++ });
            }
        }

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return (await GetByIdAsync(product.Id))!;
    }

    public async Task<ProductDto> UpdateAsync(int id, UpdateProductDto dto)
    {
        var existing = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException($"Product with ID {id} was not found.");

        if (!string.IsNullOrWhiteSpace(dto.Category))
        {
            var categoryId = await GetCategoryIdByNameAsync(dto.Category);
            if (categoryId == null)
                throw new ArgumentException("Invalid category.");
            existing.CategoryId = categoryId.Value;
        }

        if (dto.ClearMaterial)
            existing.MaterialId = null;
        else if (dto.MaterialId.HasValue)
        {
            if (dto.MaterialId > 0)
            {
                if (!await MaterialExistsAsync(dto.MaterialId.Value))
                    throw new ArgumentException("Invalid material.");
                existing.MaterialId = dto.MaterialId;
            }
            else
                existing.MaterialId = null;
        }

        existing.Name = dto.Name.Trim();
        existing.Description = dto.Description.Trim();
        existing.Price = dto.Price;
        existing.Weight = string.IsNullOrWhiteSpace(dto.Weight) ? null : dto.Weight.Trim();
        existing.IsAvailable = dto.IsAvailable;
        existing.Stock = dto.Stock;
        existing.UpdatedAt = DateTime.UtcNow;

        if (dto.Imagen != null)
        {
            _fileValidation.ValidateImage(dto.Imagen);
            var oldUrl = existing.ImageUrl;
            var newUrl = await UploadImageAsync(dto.Imagen);
            existing.ImageUrl = newUrl;

            var primary = existing.Images.OrderBy(i => i.SortOrder).FirstOrDefault();
            if (primary != null)
            {
                await TryDeleteImageByUrlAsync(primary.Url);
                primary.Url = newUrl;
            }
            else
            {
                existing.Images.Add(new ProductImage { Url = newUrl, SortOrder = 0 });
            }

            if (!string.Equals(oldUrl, newUrl, StringComparison.Ordinal))
                await TryDeleteImageByUrlAsync(oldUrl);
        }
        else if (!string.IsNullOrWhiteSpace(dto.ImageUrl))
            existing.ImageUrl = dto.ImageUrl;

        if (!string.IsNullOrWhiteSpace(dto.RemoveImageIds))
        {
            var removeIds = dto.RemoveImageIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(s => int.TryParse(s, out var imageId) ? imageId : -1)
                .Where(imageId => imageId > 0)
                .ToHashSet();

            foreach (var image in existing.Images.Where(i => removeIds.Contains(i.Id)).ToList())
            {
                await TryDeleteImageByUrlAsync(image.Url);
                existing.Images.Remove(image);
            }
        }

        if (dto.Imagenes != null)
        {
            var nextSort = existing.Images.Count == 0 ? 0 : existing.Images.Max(i => i.SortOrder) + 1;
            foreach (var extra in dto.Imagenes.Where(f => f.Length > 0))
            {
                _fileValidation.ValidateImage(extra);
                var url = await UploadImageAsync(extra);
                existing.Images.Add(new ProductImage { Url = url, SortOrder = nextSort++ });
            }
        }

        SyncPrimaryImageUrl(existing);

        await _context.SaveChangesAsync();
        return (await GetByIdAsync(existing.Id))!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return false;

        var hasActiveLines = await _context.OrderLines.AnyAsync(l => l.ProductId == id);
        if (hasActiveLines)
        {
            product.IsDeleted = true;
            product.IsAvailable = false;
            product.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            _logger.LogInformation("Soft-deleted product {ProductId} (referenced in orders)", id);
            return true;
        }

        await TryDeleteImageByUrlAsync(product.ImageUrl);
        foreach (var image in await _context.ProductImages.Where(i => i.ProductId == id).ToListAsync())
            await TryDeleteImageByUrlAsync(image.Url);
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Hard-deleted product {ProductId}", id);
        return true;
    }

    private async Task<PagedResult<ProductDto>> BuildPagedQuery(ProductListQuery q)
    {
        var pageSize = Math.Clamp(q.PageSize, 1, 100);
        var baseQuery = QueryWithIncludes();

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

        return new PagedResult<ProductDto>
        {
            Items = items.Select(p => p.ToDto()).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    private IQueryable<Product> QueryWithIncludes() =>
        _context.Products
            .Include(p => p.Category)
            .Include(p => p.MaterialEntity)
            .Include(p => p.Images);

    private static void SyncPrimaryImageUrl(Product product)
    {
        var primary = product.Images.OrderBy(i => i.SortOrder).FirstOrDefault();
        product.ImageUrl = primary?.Url;
    }

    private async Task<string> UploadImageAsync(IFormFile imagen)
    {
        using var stream = imagen.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(imagen.FileName, stream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
        };
        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.Url.ToString();
    }

    private async Task TryDeleteImageByUrlAsync(string? imageUrl)
    {
        var publicId = ExtractPublicId(imageUrl);
        if (publicId == null)
            return;

        try
        {
            await _cloudinary.DestroyAsync(new DeletionParams(publicId));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Could not delete Cloudinary image {PublicId}", publicId);
        }
    }

    internal static string? ExtractPublicId(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return null;

        const string marker = "/upload/";
        var idx = url.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (idx < 0)
            return null;

        var after = url[(idx + marker.Length)..];
        if (after.StartsWith('v') && after.Length > 1)
        {
            var slash = after.IndexOf('/');
            if (slash > 0 && after[1..slash].All(char.IsDigit))
                after = after[(slash + 1)..];
        }

        var dot = after.LastIndexOf('.');
        return dot > 0 ? after[..dot] : after;
    }
}
