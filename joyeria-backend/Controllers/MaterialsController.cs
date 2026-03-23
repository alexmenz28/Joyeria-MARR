using JoyeriaBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/materials")]
public class MaterialsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MaterialsController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>All materials for catalog filters and admin product forms (id + name).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _context.Materials.AsNoTracking()
            .OrderBy(m => m.Name)
            .Select(m => new { m.Id, m.Name })
            .ToListAsync(cancellationToken);
        return Ok(list);
    }
}
