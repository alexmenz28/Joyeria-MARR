using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JoyeriaBackend.Models;

public class Product
{
    [NotMapped]
    [JsonPropertyName("category")]
    public string? CategoryLabel => Category?.Name;

    /// <summary>Serialized as <c>material</c> for API consumers (display name from FK).</summary>
    [NotMapped]
    [JsonPropertyName("material")]
    public string? MaterialLabel => MaterialEntity?.Name;

    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public required string Name { get; set; }

    [Required]
    public required string Description { get; set; }

    [Required]
    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [ForeignKey("CategoryId")]
    [JsonIgnore]
    public Category Category { get; set; } = null!;

    public int? MaterialId { get; set; }

    [ForeignKey("MaterialId")]
    [JsonIgnore]
    public Material? MaterialEntity { get; set; }

    public string? Weight { get; set; }

    public bool IsAvailable { get; set; } = true;

    public int Stock { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
