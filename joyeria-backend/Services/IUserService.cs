using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;

namespace JoyeriaBackend.Services;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
    Task<User?> UpdateAsync(int id, User user);
    Task<bool> DeleteAsync(int id);
    Task<AuthResult> Register(RegisterDto registerDto);
    Task<AuthResult> Login(LoginDto loginDto);
    Task<UserProfileDto?> GetProfileAsync(int userId);
    Task<UserProfileDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    Task<(bool Ok, string? Error)> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    Task<PagedResult<UserListItemDto>> GetUsersPagedAsync(UserListQuery query);
    Task<(UserListItemDto? User, string? Error)> UpdateUserAdminAsync(int userId, UpdateUserAdminDto dto, int actorUserId);
}
