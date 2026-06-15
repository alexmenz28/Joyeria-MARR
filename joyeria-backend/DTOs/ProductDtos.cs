using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.DTOs;

public class ProductImageDto
{
    public int Id { get; set; }
    public string Url { get; set; } = "";
    public int SortOrder { get; set; }
}

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public List<ProductImageDto> Images { get; set; } = new();
    public string Category { get; set; } = "";
    public int? MaterialId { get; set; }
    public string? Material { get; set; }
    public string? Weight { get; set; }
    public bool IsAvailable { get; set; }
    public int Stock { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateProductDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = "";

    [Required]
    public string Description { get; set; } = "";

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [Required]
    public string Category { get; set; } = "";

    public int? MaterialId { get; set; }

    public string? Weight { get; set; }

    public bool IsAvailable { get; set; } = true;

    [Required]
    [FromForm(Name = "imagen")]
    public IFormFile Imagen { get; set; } = null!;

    /// <summary>Additional gallery images (optional).</summary>
    [FromForm(Name = "imagenes")]
    public List<IFormFile>? Imagenes { get; set; }
}

public class UpdateProductDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = "";

    [Required]
    public string Description { get; set; } = "";

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    public string? Category { get; set; }

    public int? MaterialId { get; set; }

    public bool ClearMaterial { get; set; }

    public string? Weight { get; set; }

    public bool IsAvailable { get; set; } = true;

    [FromForm(Name = "imagen")]
    public IFormFile? Imagen { get; set; }

    public string? ImageUrl { get; set; }

    [FromForm(Name = "imagenes")]
    public List<IFormFile>? Imagenes { get; set; }

    /// <summary>Comma-separated ProductImage ids to remove.</summary>
    public string? RemoveImageIds { get; set; }
}
