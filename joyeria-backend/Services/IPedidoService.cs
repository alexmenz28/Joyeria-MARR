using JoyeriaBackend.Models;

namespace JoyeriaBackend.Services
{
    public interface IPedidoService
    {
        Task<Pedido> GetByIdAsync(int id);
        Task<IEnumerable<Pedido>> GetAllAsync();
        Task<IEnumerable<Pedido>> GetByUsuarioIdAsync(int usuarioId);
        Task<Pedido> CreateAsync(Pedido pedido);
        Task<Pedido> UpdateAsync(Pedido pedido);
        Task DeleteAsync(int id);
        Task<Pedido> UpdateEstadoAsync(int id, string nuevoEstado);
    }
} 