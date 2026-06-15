using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;

namespace JoyeriaBackend.Mapping;

public static class EntityMappers
{
    public static ProductDto ToDto(this Product p)
    {
        var imageRows = p.Images?
            .OrderBy(i => i.SortOrder)
            .ToList() ?? new List<ProductImage>();

        var urls = imageRows
            .Select(i => i.Url)
            .Where(u => !string.IsNullOrWhiteSpace(u))
            .ToList();

        if (urls.Count == 0 && !string.IsNullOrWhiteSpace(p.ImageUrl))
            urls = new List<string> { p.ImageUrl };

        var primary = urls.FirstOrDefault() ?? p.ImageUrl;

        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = primary,
            ImageUrls = urls,
            Images = imageRows.Select(i => new ProductImageDto
            {
                Id = i.Id,
                Url = i.Url,
                SortOrder = i.SortOrder,
            }).ToList(),
            Category = p.Category?.Name ?? "",
            MaterialId = p.MaterialId,
            Material = p.MaterialEntity?.Name,
            Weight = p.Weight,
            IsAvailable = p.IsAvailable,
            Stock = p.Stock,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
        };
    }

    public static OrderUserDto ToOrderUserDto(this User u) => new()
    {
        Id = u.Id,
        FirstName = u.FirstName,
        LastName = u.LastName,
        Email = u.Email,
        RoleId = u.RoleId,
        Role = u.Role == null ? null : new RoleOptionDto { Id = u.Role.Id, Name = u.Role.Name },
        CreatedAt = u.CreatedAt,
        IsActive = u.IsActive,
    };

    public static OrderLineDto ToDto(this OrderLine line) => new()
    {
        Id = line.Id,
        OrderId = line.OrderId,
        ProductId = line.ProductId,
        Product = line.Product?.ToDto(),
        Quantity = line.Quantity,
        UnitPrice = line.UnitPrice,
        CustomDescription = line.CustomDescription,
    };

    public static OrderSummaryDto ToSummaryDto(this Order o) => new()
    {
        Id = o.Id,
        UserId = o.UserId,
        User = o.User?.ToOrderUserDto(),
        OrderedAt = o.OrderedAt,
        Status = o.OrderStatus?.Name,
        Notes = o.Notes,
        Subtotal = o.Subtotal,
        TaxAmount = o.TaxAmount,
        ShippingAmount = o.ShippingAmount,
        Total = o.Total,
        ShipStreet = o.ShipStreet,
        ShipCity = o.ShipCity,
        ShipState = o.ShipState,
        ShipPostalCode = o.ShipPostalCode,
        ShipCountry = o.ShipCountry,
    };

    public static OrderDetailDto ToDetailDto(this Order o)
    {
        var summary = o.ToSummaryDto();
        return new OrderDetailDto
        {
            Id = summary.Id,
            UserId = summary.UserId,
            User = summary.User,
            OrderedAt = summary.OrderedAt,
            Status = summary.Status,
            Notes = summary.Notes,
            Subtotal = summary.Subtotal,
            TaxAmount = summary.TaxAmount,
            ShippingAmount = summary.ShippingAmount,
            Total = summary.Total,
            ShipStreet = summary.ShipStreet,
            ShipCity = summary.ShipCity,
            ShipState = summary.ShipState,
            ShipPostalCode = summary.ShipPostalCode,
            ShipCountry = summary.ShipCountry,
            Lines = o.Lines.Select(l => l.ToDto()).ToList(),
        };
    }
}
