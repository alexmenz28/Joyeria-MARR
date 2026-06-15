using JoyeriaBackend.DTOs;
using JoyeriaBackend.Extensions;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>Orders for the authenticated user (paged, with lines). Max page size 100.</summary>
    [HttpGet("my")]
    public async Task<ActionResult<PagedResult<OrderDetailDto>>> GetMyOrders([FromQuery] PagedQuery query)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _orderService.GetMyOrdersPagedAsync(userId.Value, query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDetailDto>> GetById(int id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        var order = await _orderService.GetByIdAsync(id);
        if (order == null)
            return NotFound();

        if (User.IsInRole("Admin") || User.IsInRole("Employee"))
            return Ok(order);

        if (order.UserId != userId.Value)
            return Forbid();

        return Ok(order);
    }

    /// <summary>All orders (admin / staff), paged. Max page size 100.</summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult<PagedResult<OrderSummaryDto>>> GetAll([FromQuery] OrderListQuery query)
    {
        var result = await _orderService.GetOrdersPagedAsync(query);
        return Ok(result);
    }

    /// <summary>Place an order (catalog and/or custom lines). Decrements stock for catalog items.</summary>
    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<OrderDetailDto>> Create([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized();

        var order = await _orderService.CreateOrderForUserAsync(userId.Value, dto);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult<OrderDetailDto>> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _orderService.UpdateStatusAsync(id, dto.Status);
        return updated == null
            ? NotFound(new ApiErrorResponse { Error = "Order or status not found.", Code = "NOT_FOUND" })
            : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _orderService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
