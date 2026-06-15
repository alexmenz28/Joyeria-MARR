using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;

namespace JoyeriaBackend.Mapping;

public static class EntityMappers
{
    public static ProductDto ToDto(this Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Price = p.Price,
        ImageUrl = p.ImageUrl,
        Category = p.Category?.Name ?? "",
        MaterialId = p.MaterialId,
        Material = p.MaterialEntity?.Name,
        Weight = p.Weight,
        IsAvailable = p.IsAvailable,
        Stock = p.Stock,
        CreatedAt = p.CreatedAt,
        UpdatedAt = p.UpdatedAt,
    };

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
        Total = o.Total,
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
            Total = summary.Total,
            Lines = o.Lines.Select(l => l.ToDto()).ToList(),
        };
    }
}
