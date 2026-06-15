using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/contact-messages")]
[Authorize(Roles = "Admin,Employee")]
public class AdminContactMessagesController : ControllerBase
{
    private readonly IContactService _contactService;

    public AdminContactMessagesController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ContactMessageDto>>> GetMessages([FromQuery] PagedQuery query)
    {
        var result = await _contactService.GetPagedAsync(query);
        return Ok(result);
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var ok = await _contactService.MarkReadAsync(id);
        if (!ok)
            return NotFound(new ApiErrorResponse { Error = "Message not found.", Code = "NOT_FOUND" });
        return NoContent();
    }
}
