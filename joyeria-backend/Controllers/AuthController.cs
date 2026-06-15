using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace JoyeriaBackend.Controllers;

[Route("api/auth")]
[ApiController]
[EnableRateLimiting("auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _userService.Register(registerDto);
        if (!result.Success)
            return BadRequest(new ApiErrorResponse { Error = result.Message, Code = "BUSINESS_ERROR" });

        return Ok(new { message = result.Message });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _userService.Login(loginDto);
        if (!result.Success)
            return Unauthorized(new ApiErrorResponse { Error = result.Message, Code = "UNAUTHORIZED" });

        return Ok(new { token = result.Token });
    }
}
