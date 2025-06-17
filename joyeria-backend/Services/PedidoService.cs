using JoyeriaBackend.Data;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Services
{
    public class PedidoService : IPedidoService
    {
        private readonly ApplicationDbContext _context;

        public PedidoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Pedido?> GetByIdAsync(int id)
        {
            return await _context.Pedidos
                                 .Include(p => p.Detalles)
                                 .ThenInclude(d => d.Producto)
                                 .Include(p => p.Usuario)
                                 .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Pedido>> GetAllAsync()
        {
            return await _context.Pedidos
                                 .Include(p => p.Detalles)
                                 .ThenInclude(d => d.Producto)
                                 .Include(p => p.Usuario)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Pedido>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Pedidos
                                 .Where(p => p.UsuarioId == usuarioId)
                                 .Include(p => p.Detalles)
                                 .ThenInclude(d => d.Producto)
                                 .ToListAsync();
        }

        public async Task<Pedido> CreateAsync(Pedido pedido)
        {
            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();
            return pedido;
        }

        public async Task<Pedido> UpdateAsync(Pedido pedido)
        {
            _context.Entry(pedido).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return pedido;
        }

        public async Task DeleteAsync(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido != null)
            {
                _context.Pedidos.Remove(pedido);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Pedido?> UpdateEstadoAsync(int id, string nuevoEstado)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return null;
            }

            pedido.Estado = nuevoEstado;
            _context.Entry(pedido).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return pedido;
        }
    }
} 