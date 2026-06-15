using JoyeriaBackend.DTOs;
using Microsoft.Extensions.Configuration;

namespace JoyeriaBackend.Services;

public interface ICheckoutPricingService
{
    CheckoutQuoteDto Quote(decimal subtotal, ShippingAddressDto shipping);
}

public class CheckoutPricingService : ICheckoutPricingService
{
    private readonly decimal _shippingAmount;
    private readonly decimal _freeShippingThreshold;
    private readonly Dictionary<string, decimal> _taxRates;

    public CheckoutPricingService(IConfiguration configuration)
    {
        var section = configuration.GetSection("Checkout");
        _shippingAmount = section.GetValue("DefaultShippingAmount", 15m);
        _freeShippingThreshold = section.GetValue("FreeShippingThreshold", 500m);

        _taxRates = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase)
        {
            ["DEFAULT"] = section.GetValue<decimal?>("TaxRates:DEFAULT") ?? 0m,
            ["MX"] = section.GetValue<decimal?>("TaxRates:MX") ?? 0.16m,
            ["US"] = section.GetValue<decimal?>("TaxRates:US") ?? 0.08m,
            ["ES"] = section.GetValue<decimal?>("TaxRates:ES") ?? 0.21m,
        };
    }

    public CheckoutQuoteDto Quote(decimal subtotal, ShippingAddressDto shipping)
    {
        var country = shipping.Country.Trim().ToUpperInvariant();
        var taxRate = _taxRates.TryGetValue(country, out var rate) ? rate : _taxRates["DEFAULT"];
        var shippingAmount = subtotal >= _freeShippingThreshold ? 0m : _shippingAmount;
        var taxAmount = Math.Round(subtotal * taxRate, 2, MidpointRounding.AwayFromZero);
        var total = subtotal + taxAmount + shippingAmount;

        return new CheckoutQuoteDto
        {
            Subtotal = subtotal,
            TaxRate = taxRate,
            TaxAmount = taxAmount,
            ShippingAmount = shippingAmount,
            Total = total,
            Country = country,
        };
    }
}
