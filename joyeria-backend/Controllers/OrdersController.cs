using System.Security.Claims;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;
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

    private int? GetCurrentUserId()
    {
        var v = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(v, out var id) ? id : null;
    }

    /// <summary>Orders for the authenticated user (paged, with lines). Max page size 100.</summary>
    [HttpGet("my")]
    public async Task<ActionResult<PagedResult<Order>>> GetMyOrders([FromQuery] PagedQuery query)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _orderService.GetMyOrdersPagedAsync(userId.Value, query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetById(int id)
    {
        var userId = GetCurrentUserId();
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
    public async Task<ActionResult<PagedResult<Order>>> GetAll([FromQuery] OrderListQuery query)
    {
        var result = await _orderService.GetOrdersPagedAsync(query);
        return Ok(result);
    }

    /// <summary>Place an order (catalog lines only). Decrements stock.</summary>
    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<Order>> Create([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        try
        {
            var order = await _orderService.CreateOrderForUserAsync(userId.Value, dto);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<ActionResult<Order>> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _orderService.UpdateStatusAsync(id, dto.Status);
        if (updated == null)
            return NotFound(new { message = "Order or status not found." });

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _orderService.DeleteAsync(id);
        return NoContent();
    }
}
