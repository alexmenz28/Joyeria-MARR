using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/stats")]
[Authorize(Roles = "Admin,Employee")]
public class AdminStatsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminStatsController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>Counts, revenue total, and last 5 orders for the admin dashboard.</summary>
    [HttpGet]
    public async Task<ActionResult<AdminDashboardStatsDto>> GetDashboardStats(CancellationToken cancellationToken)
    {
        var productCount = await _db.Products.CountAsync(cancellationToken);
        var orderCount = await _db.Orders.CountAsync(cancellationToken);
        var userCount = await _db.Users.CountAsync(cancellationToken);

        var customerRole = await _db.Roles.AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == "Customer", cancellationToken);
        var customerCount = customerRole == null
            ? 0
            : await _db.Users.CountAsync(u => u.RoleId == customerRole.Id, cancellationToken);

        var revenue = await _db.Orders.SumAsync(o => o.Total, cancellationToken);

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

        return Ok(new AdminDashboardStatsDto
        {
            ProductCount = productCount,
            OrderCount = orderCount,
            CustomerCount = customerCount,
            UserCount = userCount,
            OrdersRevenueTotal = revenue,
            RecentOrders = recentOrders,
        });
    }
}
