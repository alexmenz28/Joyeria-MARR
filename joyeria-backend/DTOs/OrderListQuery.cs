namespace JoyeriaBackend.DTOs;

/// <summary>Query parameters for admin <c>GET /api/orders</c>.</summary>
public class OrderListQuery
{
    public int Page { get; set; } = 1;

    /// <summary>Clamped server-side (max 100).</summary>
    public int PageSize { get; set; } = 10;

    /// <summary>Filter by order id (if numeric) or customer email / name.</summary>
    public string? Search { get; set; }
}
