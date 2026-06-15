using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public CategoriesController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    /// <summary>All category names for filters (lightweight; safe for public catalog).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetNames(CancellationToken cancellationToken)
    {
        var names = await _catalogService.GetCategoryNamesAsync(cancellationToken);
        return Ok(names);
    }
}
