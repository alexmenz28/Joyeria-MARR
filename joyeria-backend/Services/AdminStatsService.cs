using System.Globalization;
using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Services;

public class AdminStatsService : IAdminStatsService
{
    private readonly ApplicationDbContext _db;

    public AdminStatsService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<AdminDashboardStatsDto> GetDashboardStatsAsync(CancellationToken cancellationToken = default)
    {
        var productCount = await _db.Products.CountAsync(cancellationToken);
        var orderCount = await _db.Orders.CountAsync(cancellationToken);
        var userCount = await _db.Users.CountAsync(cancellationToken);

        var customerRole = await _db.Roles.AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == "Customer", cancellationToken);
        var customerCount = customerRole == null
            ? 0
            : await _db.Users.CountAsync(u => u.RoleId == customerRole.Id, cancellationToken);

        var completedStatus = await _db.OrderStatuses.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Name == OrderStatusNames.Completed, cancellationToken);

        var revenue = completedStatus == null
            ? 0m
            : await _db.Orders
                .Where(o => o.OrderStatusId == completedStatus.Id)
                .SumAsync(o => o.Total, cancellationToken);

        var recentOrders = await _db.Orders
            .AsNoTracking()
            .OrderByDescending(o => o.OrderedAt)
            .Take(5)
            .Select(o => new RecentOrderSummaryDto
            {
                Id = o.Id,
                CustomerName = o.User.FirstName + " " + o.User.LastName,
                OrderedAt = o.OrderedAt,
                Total = o.Total,
                Status = o.OrderStatus.Name,
            })
            .ToListAsync(cancellationToken);

        return new AdminDashboardStatsDto
        {
            ProductCount = productCount,
            OrderCount = orderCount,
            CustomerCount = customerCount,
            UserCount = userCount,
            OrdersRevenueTotal = revenue,
            RecentOrders = recentOrders,
        };
    }

    public async Task<SalesSummaryDto> GetSalesSummaryAsync(int months, CancellationToken cancellationToken = default)
    {
        months = Math.Clamp(months, 1, 36);
        var now = DateTime.UtcNow;
        var start = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc)
            .AddMonths(-(months - 1));

        var completedStatus = await _db.OrderStatuses.AsNoTracking()
            .FirstOrDefaultAsync(s => s.Name == OrderStatusNames.Completed, cancellationToken);

        var ordersInRange = _db.Orders.AsNoTracking()
            .Where(o => o.OrderedAt >= start);

        var grouped = await ordersInRange
            .GroupBy(o => new { o.OrderedAt.Year, o.OrderedAt.Month })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                OrderCount = g.Count(),
                Revenue = completedStatus == null
                    ? 0m
                    : g.Where(o => o.OrderStatusId == completedStatus.Id).Sum(o => o.Total),
            })
            .ToListAsync(cancellationToken);

        var map = grouped.ToDictionary(
            x => (x.Year, x.Month),
            x => (Revenue: x.Revenue, OrderCount: x.OrderCount));

        var monthly = new List<SalesMonthlyPointDto>();
        for (var i = 0; i < months; i++)
        {
            var d = start.AddMonths(i);
            map.TryGetValue((d.Year, d.Month), out var row);
            monthly.Add(new SalesMonthlyPointDto
            {
                Year = d.Year,
                Month = d.Month,
                Label = d.ToString("MMM yyyy", CultureInfo.GetCultureInfo("en-US")),
                Revenue = row.Revenue,
                OrderCount = row.OrderCount,
            });
        }

        return new SalesSummaryDto
        {
            Monthly = monthly,
            TotalRevenueInRange = monthly.Sum(m => m.Revenue),
            TotalOrdersInRange = monthly.Sum(m => m.OrderCount),
            Months = months,
            ByCategory = await GetCategoryBreakdownAsync(start, completedStatus?.Id, cancellationToken),
            ByMaterial = await GetMaterialBreakdownAsync(start, completedStatus?.Id, cancellationToken),
            TopProducts = await GetTopProductsAsync(start, completedStatus?.Id, cancellationToken),
        };
    }

    private async Task<List<SalesBreakdownDto>> GetCategoryBreakdownAsync(
        DateTime start,
        int? completedStatusId,
        CancellationToken cancellationToken)
    {
        if (completedStatusId == null)
            return new List<SalesBreakdownDto>();

        var rows = await _db.OrderLines.AsNoTracking()
            .Where(l => l.ProductId != null
                        && l.Order.OrderedAt >= start
                        && l.Order.OrderStatusId == completedStatusId)
            .GroupBy(l => l.Product!.Category.Name)
            .Select(g => new SalesBreakdownDto
            {
                Name = g.Key,
                Revenue = g.Sum(l => l.UnitPrice * l.Quantity),
                UnitsSold = g.Sum(l => l.Quantity),
            })
            .OrderByDescending(x => x.Revenue)
            .Take(12)
            .ToListAsync(cancellationToken);

        return rows;
    }

    private async Task<List<SalesBreakdownDto>> GetMaterialBreakdownAsync(
        DateTime start,
        int? completedStatusId,
        CancellationToken cancellationToken)
    {
        if (completedStatusId == null)
            return new List<SalesBreakdownDto>();

        var rows = await _db.OrderLines.AsNoTracking()
            .Where(l => l.ProductId != null
                        && l.Product!.MaterialEntity != null
                        && l.Order.OrderedAt >= start
                        && l.Order.OrderStatusId == completedStatusId)
            .GroupBy(l => l.Product!.MaterialEntity!.Name)
            .Select(g => new SalesBreakdownDto
            {
                Name = g.Key,
                Revenue = g.Sum(l => l.UnitPrice * l.Quantity),
                UnitsSold = g.Sum(l => l.Quantity),
            })
            .OrderByDescending(x => x.Revenue)
            .Take(12)
            .ToListAsync(cancellationToken);

        return rows;
    }

    private async Task<List<TopProductDto>> GetTopProductsAsync(
        DateTime start,
        int? completedStatusId,
        CancellationToken cancellationToken)
    {
        if (completedStatusId == null)
            return new List<TopProductDto>();

        return await _db.OrderLines.AsNoTracking()
            .Where(l => l.ProductId != null
                        && l.Order.OrderedAt >= start
                        && l.Order.OrderStatusId == completedStatusId)
            .GroupBy(l => new { l.ProductId, l.Product!.Name })
            .Select(g => new TopProductDto
            {
                ProductId = g.Key.ProductId!.Value,
                Name = g.Key.Name,
                QuantitySold = g.Sum(l => l.Quantity),
                Revenue = g.Sum(l => l.UnitPrice * l.Quantity),
            })
            .OrderByDescending(x => x.QuantitySold)
            .Take(10)
            .ToListAsync(cancellationToken);
    }
}
