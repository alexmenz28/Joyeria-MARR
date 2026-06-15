using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/sales")]
[Authorize(Roles = "Admin,Employee")]
public class AdminSalesController : ControllerBase
{
    private readonly IAdminStatsService _statsService;

    public AdminSalesController(IAdminStatsService statsService)
    {
        _statsService = statsService;
    }

    /// <summary>Monthly revenue (completed orders) and order counts for the last N calendar months.</summary>
    [HttpGet("summary")]
    public async Task<ActionResult<SalesSummaryDto>> GetSummary(
        [FromQuery] int months = 12,
        CancellationToken cancellationToken = default)
    {
        var dto = await _statsService.GetSalesSummaryAsync(months, cancellationToken);
        return Ok(dto);
    }
}
