using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/materials")]
public class MaterialsController : ControllerBase
{
    private readonly ICatalogService _catalogService;

    public MaterialsController(ICatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    /// <summary>All materials for catalog filters and admin product forms (id + name).</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MaterialRefDto>>> GetAll(CancellationToken cancellationToken)
    {
        var list = await _catalogService.GetMaterialsAsync(cancellationToken);
        return Ok(list);
    }
}
