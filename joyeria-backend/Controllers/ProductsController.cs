using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JoyeriaBackend.Services;
using JoyeriaBackend.Models;
using JoyeriaBackend.DTOs;
using Microsoft.AspNetCore.Http;

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
    public async Task<ActionResult<PagedResult<Product>>> GetProducts([FromQuery] ProductListQuery query)
    {
        var result = await _productService.GetPagedAsync(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
            return NotFound();
        return Ok(product);
    }

    [HttpGet("category/{categoryName}")]
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategory(string categoryName)
    {
        var products = await _productService.GetByCategoryNameAsync(categoryName);
        return Ok(products);
    }

    [Authorize(Roles = "Admin,Employee")]
    [HttpPost]
    public async Task<ActionResult<Product>> Create([FromForm] Product product, [FromForm] string? category, IFormFile imagen)
    {
        if (imagen == null)
            return BadRequest("Image is required.");

        var categoryId = await _productService.GetCategoryIdByNameAsync(category ?? "");
        if (categoryId == null)
            return BadRequest("Invalid category.");

        product.CategoryId = categoryId.Value;
        var created = await _productService.CreateAsync(product, imagen);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin,Employee")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromForm] Product product, [FromForm] string? category, IFormFile? imagen)
    {
        if (id != product.Id)
            return BadRequest();

        if (!string.IsNullOrEmpty(category))
        {
            var categoryId = await _productService.GetCategoryIdByNameAsync(category);
            if (categoryId != null)
                product.CategoryId = categoryId.Value;
        }

        await _productService.UpdateAsync(product, imagen);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _productService.DeleteAsync(id);
        return NoContent();
    }
}
