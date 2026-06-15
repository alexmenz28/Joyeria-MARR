using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.DTOs;

public class ShippingAddressDto
{
    [Required]
    [StringLength(200)]
    public string Street { get; set; } = "";

    [Required]
    [StringLength(100)]
    public string City { get; set; } = "";

    [StringLength(100)]
    public string? State { get; set; }

    [Required]
    [StringLength(20)]
    public string PostalCode { get; set; } = "";

    [Required]
    [StringLength(2, MinimumLength = 2)]
    public string Country { get; set; } = "";
}

public class CheckoutQuoteRequestDto
{
    [Range(0, double.MaxValue)]
    public decimal Subtotal { get; set; }

    [Required]
    public ShippingAddressDto Shipping { get; set; } = null!;
}

public class CheckoutQuoteDto
{
    public decimal Subtotal { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal Total { get; set; }
    public string Country { get; set; } = "";
}
