using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/stats")]
[Authorize(Roles = "Admin,Employee")]
public class AdminStatsController : ControllerBase
{
    private readonly IAdminStatsService _statsService;

    public AdminStatsController(IAdminStatsService statsService)
    {
        _statsService = statsService;
    }

    /// <summary>Counts, completed-order revenue, and last 5 orders for the admin dashboard.</summary>
    [HttpGet]
    public async Task<ActionResult<AdminDashboardStatsDto>> GetDashboardStats(CancellationToken cancellationToken)
    {
        var stats = await _statsService.GetDashboardStatsAsync(cancellationToken);
        return Ok(stats);
    }
}
