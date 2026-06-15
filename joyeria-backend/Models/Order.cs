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

    public decimal Subtotal { get; set; }

    public decimal TaxAmount { get; set; }

    public decimal ShippingAmount { get; set; }

    public decimal Total { get; set; }

    [StringLength(200)]
    public string? ShipStreet { get; set; }

    [StringLength(100)]
    public string? ShipCity { get; set; }

    [StringLength(100)]
    public string? ShipState { get; set; }

    [StringLength(20)]
    public string? ShipPostalCode { get; set; }

    [StringLength(2)]
    public string? ShipCountry { get; set; }

    public List<OrderLine> Lines { get; set; } = new();
}
