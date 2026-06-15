using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/order-statuses")]
public class OrderStatusesController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public OrderStatusesController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    /// <summary>Order status reference list for admin dropdowns.</summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult<List<OrderStatusDto>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _catalogService.GetOrderStatusesAsync(cancellationToken);
        return Ok(list);
    }
}
