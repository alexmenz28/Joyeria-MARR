using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/contact")]
[EnableRateLimiting("contact")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    /// <summary>Public contact form — persists message for staff review.</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactMessageDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _contactService.CreateAsync(dto);
        return Ok(new { message = "Thank you. We will get back to you soon." });
    }
}
