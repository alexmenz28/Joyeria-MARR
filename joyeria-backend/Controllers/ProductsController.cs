using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    /// <summary>Paged product list (catalog + admin). Max page size 100.</summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts([FromQuery] ProductListQuery query)
    {
        var result = await _productService.GetPagedAsync(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        return product == null ? NotFound() : Ok(product);
    }

    /// <summary>Deprecated — use GET /api/products?category={name} instead.</summary>
    [HttpGet("category/{categoryName}")]
    [Obsolete("Use GET /api/products?category={name} with pagination.")]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetByCategory(
        string categoryName,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 100)
    {
        Response.Headers.Append("Deprecation", "true");
        Response.Headers.Append("Link", "</api/products?category=" + Uri.EscapeDataString(categoryName) + ">; rel=\"successor-version\"");
        var result = await _productService.GetByCategoryNamePagedAsync(categoryName, new PagedQuery { Page = page, PageSize = pageSize });
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Employee")]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        ApplyMaterialIdFromForm(dto);

        var created = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin,Employee")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        ApplyMaterialIdFromForm(dto);

        var updated = await _productService.UpdateAsync(id, dto);
        return Ok(updated);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private void ApplyMaterialIdFromForm(CreateProductDto dto)
    {
        if (!Request.HasFormContentType || !Request.Form.ContainsKey("materialId"))
            return;

        var raw = Request.Form["materialId"].ToString();
        if (string.IsNullOrWhiteSpace(raw))
            dto.MaterialId = null;
        else if (int.TryParse(raw, out var matId))
            dto.MaterialId = matId;
    }

    private void ApplyMaterialIdFromForm(UpdateProductDto dto)
    {
        if (!Request.HasFormContentType || !Request.Form.ContainsKey("materialId"))
            return;

        var raw = Request.Form["materialId"].ToString();
        if (string.IsNullOrWhiteSpace(raw))
            dto.ClearMaterial = true;
        else if (int.TryParse(raw, out var matId))
            dto.MaterialId = matId;
    }
}
