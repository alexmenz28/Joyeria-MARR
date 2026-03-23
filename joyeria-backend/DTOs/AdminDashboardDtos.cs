namespace JoyeriaBackend.DTOs;

/// <summary>Aggregates for the admin dashboard (no entity graphs; safe for JSON).</summary>
public class AdminDashboardStatsDto
{
    public int ProductCount { get; set; }
    public int OrderCount { get; set; }
    /// <summary>Users with role Customer.</summary>
    public int CustomerCount { get; set; }
    /// <summary>All registered users.</summary>
    public int UserCount { get; set; }
    /// <summary>Sum of <c>Order.Total</c> (gross, no tax breakdown).</summary>
    public decimal OrdersRevenueTotal { get; set; }
    public List<RecentOrderSummaryDto> RecentOrders { get; set; } = new();
}

public class RecentOrderSummaryDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = "";
    public DateTime OrderedAt { get; set; }
    public decimal Total { get; set; }
    public string? Status { get; set; }
}
