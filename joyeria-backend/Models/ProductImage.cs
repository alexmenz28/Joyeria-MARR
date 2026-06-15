using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JoyeriaBackend.Models;

public class ProductImage
{
    public int Id { get; set; }

    [Required]
    public int ProductId { get; set; }

    [ForeignKey(nameof(ProductId))]
    public Product Product { get; set; } = null!;

    [Required]
    [StringLength(500)]
    public required string Url { get; set; }

    public int SortOrder { get; set; }
}
