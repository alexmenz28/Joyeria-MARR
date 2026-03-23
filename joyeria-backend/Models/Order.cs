using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JoyeriaBackend.Models;

public class Order
{
    [NotMapped]
    [JsonPropertyName("status")]
    public string? Status => OrderStatus?.Name;

    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public int OrderStatusId { get; set; }

    [ForeignKey("OrderStatusId")]
    [JsonIgnore]
    public OrderStatus OrderStatus { get; set; } = null!;

    public string? Notes { get; set; }

    public decimal Total { get; set; }

    public List<OrderLine> Lines { get; set; } = new();
}
