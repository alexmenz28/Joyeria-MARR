using JoyeriaBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>All category names for filters (lightweight; safe for public catalog).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetNames()
    {
        var names = await _context.Categories
            .OrderBy(c => c.Name)
            .Select(c => c.Name)
            .ToListAsync();
        return Ok(names);
    }
}
