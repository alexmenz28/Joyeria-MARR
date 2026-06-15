using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
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
}
