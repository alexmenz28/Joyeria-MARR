using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.DTOs;

public class CreateOrderLineDto
{
    /// <summary>Catalog line: set to product id. Custom line: omit or null and set <see cref="CustomDescription"/>.</summary>
    public int? ProductId { get; set; }

    [Required]
    [Range(1, 999)]
    public int Quantity { get; set; } = 1;

    /// <summary>Required when <see cref="ProductId"/> is null or 0. Price is set to 0 (quote pending).</summary>
    [StringLength(2000)]
    public string? CustomDescription { get; set; }
}
