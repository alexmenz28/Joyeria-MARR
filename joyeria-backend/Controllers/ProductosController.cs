using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using JoyeriaBackend.Services;
using JoyeriaBackend.Models;
using Microsoft.AspNetCore.Http;

namespace JoyeriaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductosController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var productos = await _productoService.GetAllAsync();
            return Ok(productos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _productoService.GetByIdAsync(id);
            if (producto == null)
            {
                return NotFound();
            }
            return Ok(producto);
        }

        [HttpGet("categoria/{categoria}")]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductosPorCategoria(string categoria)
        {
            var productos = await _productoService.GetByCategoriaAsync(categoria);
            return Ok(productos);
        }

        [Authorize(Roles = "Admin,Empleado")]
        [HttpPost]
        public async Task<ActionResult<Producto>> CreateProducto([FromForm] Producto producto, IFormFile imagen)
        {
            if (imagen == null)
            {
                return BadRequest("La imagen es requerida");
            }

            var nuevoProducto = await _productoService.CreateAsync(producto, imagen);
            return CreatedAtAction(nameof(GetProducto), new { id = nuevoProducto.Id }, nuevoProducto);
        }

        [Authorize(Roles = "Admin,Empleado")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProducto(int id, [FromForm] Producto producto, IFormFile imagen)
        {
            if (id != producto.Id)
            {
                return BadRequest();
            }

            await _productoService.UpdateAsync(producto, imagen);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            await _productoService.DeleteAsync(id);
            return NoContent();
        }
    }
} 