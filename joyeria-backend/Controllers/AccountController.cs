using JoyeriaBackend.DTOs;
using JoyeriaBackend.Extensions;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/account")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly IUserService _userService;

    public AccountController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMe()
    {
        var id = User.GetUserId();
        if (id == null)
            return Unauthorized();

        var profile = await _userService.GetProfileAsync(id.Value);
        return profile == null ? NotFound() : Ok(profile);
    }

    [HttpPatch("me")]
    public async Task<ActionResult<UserProfileDto>> PatchMe([FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var id = User.GetUserId();
        if (id == null)
            return Unauthorized();

        var profile = await _userService.UpdateProfileAsync(id.Value, dto);
        return profile == null ? NotFound() : Ok(profile);
    }

    [HttpPost("me/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var id = User.GetUserId();
        if (id == null)
            return Unauthorized();

        var (ok, error) = await _userService.ChangePasswordAsync(id.Value, dto);
        if (!ok)
            return BadRequest(new ApiErrorResponse { Error = error ?? "Could not change password.", Code = "VALIDATION_ERROR" });

        return NoContent();
    }
}
