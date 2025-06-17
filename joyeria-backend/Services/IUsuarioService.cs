using JoyeriaBackend.Models;

namespace JoyeriaBackend.Services
{
    public interface IUsuarioService
    {
        Task<Usuario> GetByIdAsync(int id);
        Task<Usuario> GetByEmailAsync(string email);
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario> CreateAsync(Usuario usuario, string password);
        Task<Usuario> UpdateAsync(Usuario usuario);
        Task DeleteAsync(int id);
        Task<bool> ValidateCredentialsAsync(string email, string password);
        Task<string> GenerateJwtTokenAsync(Usuario usuario);
    }
} 