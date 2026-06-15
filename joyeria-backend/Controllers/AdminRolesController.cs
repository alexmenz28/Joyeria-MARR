using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/roles")]
[Authorize(Roles = "Admin")]
public class AdminRolesController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public AdminRolesController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    /// <summary>Roles for admin user-management dropdowns.</summary>
    [HttpGet]
    public async Task<ActionResult<List<RoleOptionDto>>> GetRoles(CancellationToken cancellationToken)
    {
        var list = await _catalogService.GetRolesAsync(cancellationToken);
        return Ok(list);
    }
}
