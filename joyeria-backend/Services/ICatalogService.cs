using JoyeriaBackend.DTOs;

namespace JoyeriaBackend.Services;

public interface ICatalogService
{
    Task<List<string>> GetCategoryNamesAsync(CancellationToken cancellationToken = default);
    Task<List<MaterialRefDto>> GetMaterialsAsync(CancellationToken cancellationToken = default);
    Task<List<OrderStatusDto>> GetOrderStatusesAsync(CancellationToken cancellationToken = default);
    Task<List<RoleOptionDto>> GetRolesAsync(CancellationToken cancellationToken = default);
}

public class MaterialRefDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}
