using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Services;

public class CatalogService : ICatalogService
{
    private readonly ApplicationDbContext _db;

    public CatalogService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<string>> GetCategoryNamesAsync(CancellationToken cancellationToken = default) =>
        await _db.Categories.AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => c.Name)
            .ToListAsync(cancellationToken);

    public async Task<List<MaterialRefDto>> GetMaterialsAsync(CancellationToken cancellationToken = default) =>
        await _db.Materials.AsNoTracking()
            .OrderBy(m => m.Name)
            .Select(m => new MaterialRefDto { Id = m.Id, Name = m.Name })
            .ToListAsync(cancellationToken);

    public async Task<List<OrderStatusDto>> GetOrderStatusesAsync(CancellationToken cancellationToken = default) =>
        await _db.OrderStatuses.AsNoTracking()
            .OrderBy(s => s.Name)
            .Select(s => new OrderStatusDto { Id = s.Id, Name = s.Name })
            .ToListAsync(cancellationToken);

    public async Task<List<RoleOptionDto>> GetRolesAsync(CancellationToken cancellationToken = default) =>
        await _db.Roles.AsNoTracking()
            .OrderBy(r => r.Name)
            .Select(r => new RoleOptionDto { Id = r.Id, Name = r.Name })
            .ToListAsync(cancellationToken);
}
