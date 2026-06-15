namespace JoyeriaBackend.DTOs;

public class OrderUserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public int RoleId { get; set; }
    public RoleOptionDto? Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}

public class OrderLineDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int? ProductId { get; set; }
    public ProductDto? Product { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? CustomDescription { get; set; }
}

/// <summary>Lightweight order for paginated lists.</summary>
public class OrderSummaryDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public OrderUserDto? User { get; set; }
    public DateTime OrderedAt { get; set; }
    public string? Status { get; set; }
    public string? Notes { get; set; }
    public decimal Subtotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal Total { get; set; }
    public string? ShipStreet { get; set; }
    public string? ShipCity { get; set; }
    public string? ShipState { get; set; }
    public string? ShipPostalCode { get; set; }
    public string? ShipCountry { get; set; }
}

/// <summary>Full order with line items.</summary>
public class OrderDetailDto : OrderSummaryDto
{
    public List<OrderLineDto> Lines { get; set; } = new();
}

public class OrderStatusDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}
