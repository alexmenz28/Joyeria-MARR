using System.Globalization;
using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/sales")]
[Authorize(Roles = "Admin,Employee")]
public class AdminSalesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminSalesController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>Monthly revenue and order counts for the last <paramref name="months"/> calendar months (including current).</summary>
    [HttpGet("summary")]
    public async Task<ActionResult<SalesSummaryDto>> GetSummary(
        [FromQuery] int months = 12,
        CancellationToken cancellationToken = default)
    {
        months = Math.Clamp(months, 1, 36);
        var now = DateTime.UtcNow;
        var start = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc)
            .AddMonths(-(months - 1));

        var grouped = await _db.Orders.AsNoTracking()
            .Where(o => o.OrderedAt >= start)
            .GroupBy(o => new { o.OrderedAt.Year, o.OrderedAt.Month })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Revenue = g.Sum(o => o.Total),
                OrderCount = g.Count(),
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

        var dto = new SalesSummaryDto
        {
            Monthly = monthly,
            TotalRevenueInRange = monthly.Sum(m => m.Revenue),
            TotalOrdersInRange = monthly.Sum(m => m.OrderCount),
            Months = months,
        };

        return Ok(dto);
    }
}
