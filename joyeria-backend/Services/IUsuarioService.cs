using JoyeriaBackend.Models;
using JoyeriaBackend.DTOs;

namespace JoyeriaBackend.Services
{
    public interface IUsuarioService
    {
        Task<IEnumerable<Usuario>> GetAllAsync();
        Task<Usuario?> GetByIdAsync(int id);
        Task<Usuario> CreateAsync(Usuario usuario);
        Task<Usuario?> UpdateAsync(int id, Usuario usuario);
        Task<bool> DeleteAsync(int id);
        Task<AuthResult> Register(RegisterDto registerDto);
        Task<AuthResult> Login(LoginDto loginDto);
    }
} 