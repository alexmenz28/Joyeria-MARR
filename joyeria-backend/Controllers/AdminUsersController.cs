using JoyeriaBackend.Extensions;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IUserService _userService;

    public AdminUsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>Paged user list (no passwords). Admin only.</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<UserListItemDto>>> GetUsers([FromQuery] UserListQuery query)
    {
        var result = await _userService.GetUsersPagedAsync(query);
        return Ok(result);
    }

    /// <summary>Update role and/or active flag. Admin only; safeguards for last admin and self.</summary>
    [HttpPatch("{id:int}")]
    public async Task<ActionResult<UserListItemDto>> UpdateUser(int id, [FromBody] UpdateUserAdminDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var actorId = User.GetUserId();
        if (actorId == null)
            return Unauthorized();

        var (user, error) = await _userService.UpdateUserAdminAsync(id, dto, actorId.Value);
        if (error != null)
            return BadRequest(new ApiErrorResponse { Error = error, Code = "BUSINESS_ERROR" });

        return Ok(user);
    }
}
