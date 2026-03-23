using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/admin/roles")]
[Authorize(Roles = "Admin")]
public class AdminRolesController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public AdminRolesController(ApplicationDbContext db)
    {
        _db = db;
    }

    /// <summary>Roles for admin user-management dropdowns.</summary>
    [HttpGet]
    public async Task<ActionResult<List<RoleOptionDto>>> GetRoles(CancellationToken cancellationToken)
    {
        var list = await _db.Roles.AsNoTracking()
            .OrderBy(r => r.Name)
            .Select(r => new RoleOptionDto { Id = r.Id, Name = r.Name })
            .ToListAsync(cancellationToken);
        return Ok(list);
    }
}
