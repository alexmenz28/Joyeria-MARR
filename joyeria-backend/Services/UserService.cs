using JoyeriaBackend.Data;
using JoyeriaBackend.Models;
using JoyeriaBackend.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace JoyeriaBackend.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public UserService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.Include(u => u.Role).ToListAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> UpdateAsync(int id, User user)
    {
        var existing = await _context.Users.FindAsync(id);
        if (existing == null) return null;

        _context.Entry(existing).CurrentValues.SetValues(user);
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<AuthResult> Register(RegisterDto registerDto)
    {
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
        if (existingUser != null)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Email is already registered."
            };
        }

        var customerRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Customer");
        if (customerRole == null)
            return new AuthResult { Success = false, Message = "Customer role is not configured." };

        var user = new User
        {
            FirstName = registerDto.Name,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            RoleId = customerRole.Id,
            LastName = string.Empty
        };

        await CreateAsync(user);

        return new AuthResult
        {
            Success = true,
            Message = "User registered successfully."
        };
    }

    public async Task<AuthResult> Login(LoginDto loginDto)
    {
        var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == loginDto.Email);
        if (user == null)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Invalid credentials."
            };
        }

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return new AuthResult
            {
                Success = false,
                Message = "Invalid credentials."
            };
        }

        if (!user.IsActive)
        {
            return new AuthResult
            {
                Success = false,
                Message = "Invalid credentials."
            };
        }

        var token = GenerateJwtToken(user);

        return new AuthResult
        {
            Success = true,
            Message = "Login successful.",
            Token = token
        };
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is not configured."));
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? "")
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["DurationInMinutes"])),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<UserProfileDto?> GetProfileAsync(int userId)
    {
        var u = await _context.Users.AsNoTracking()
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == userId);
        if (u == null)
            return null;

        return new UserProfileDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email,
            RoleName = u.Role?.Name ?? "",
        };
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var u = await _context.Users.FindAsync(userId);
        if (u == null)
            return null;

        u.FirstName = dto.FirstName.Trim();
        u.LastName = dto.LastName.Trim();
        await _context.SaveChangesAsync();
        return await GetProfileAsync(userId);
    }

    public async Task<(bool Ok, string? Error)> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var u = await _context.Users.FindAsync(userId);
        if (u == null)
            return (false, "User not found.");

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, u.PasswordHash))
            return (false, "Current password is incorrect.");

        u.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();
        return (true, null);
    }

    public async Task<PagedResult<UserListItemDto>> GetUsersPagedAsync(UserListQuery query)
    {
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var page = Math.Max(query.Page, 1);

        var q = _context.Users.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            q = q.Where(u =>
                u.Email.Contains(s) ||
                u.FirstName.Contains(s) ||
                u.LastName.Contains(s));
        }

        var total = await q.CountAsync();
        var items = await q
            .OrderBy(u => u.Email)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new UserListItemDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                RoleId = u.RoleId,
                RoleName = u.Role.Name,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
            })
            .ToListAsync();

        return new PagedResult<UserListItemDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<(UserListItemDto? User, string? Error)> UpdateUserAdminAsync(
        int userId,
        UpdateUserAdminDto dto,
        int actorUserId)
    {
        if (!dto.RoleId.HasValue && !dto.IsActive.HasValue)
            return (null, "No changes specified.");

        var adminRole = await _context.Roles.AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == "Admin");
        if (adminRole == null)
            return (null, "Admin role is not configured.");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            return (null, "User not found.");

        var activeAdminCount = await _context.Users.CountAsync(u =>
            u.RoleId == adminRole.Id && u.IsActive);

        var targetWasActiveAdmin = user.RoleId == adminRole.Id && user.IsActive;

        if (actorUserId == userId)
        {
            if (dto.IsActive == false)
                return (null, "You cannot deactivate your own account.");
            if (dto.RoleId.HasValue && dto.RoleId.Value != adminRole.Id)
                return (null, "You cannot change your own role away from Admin.");
        }

        if (targetWasActiveAdmin)
        {
            if (dto.IsActive == false && activeAdminCount <= 1)
                return (null, "Cannot deactivate the last active administrator.");
            if (dto.RoleId.HasValue && dto.RoleId.Value != adminRole.Id && activeAdminCount <= 1)
                return (null, "Cannot remove the last administrator.");
        }

        if (dto.RoleId.HasValue)
        {
            var roleOk = await _context.Roles.AnyAsync(r => r.Id == dto.RoleId.Value);
            if (!roleOk)
                return (null, "Invalid role.");
            user.RoleId = dto.RoleId.Value;
        }

        if (dto.IsActive.HasValue)
            user.IsActive = dto.IsActive.Value;

        await _context.SaveChangesAsync();

        var updated = await _context.Users.AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new UserListItemDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                RoleId = u.RoleId,
                RoleName = u.Role.Name,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
            })
            .FirstAsync();

        return (updated, null);
    }
}
