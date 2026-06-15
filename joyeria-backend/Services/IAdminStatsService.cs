using JoyeriaBackend.DTOs;

namespace JoyeriaBackend.Services;

public interface IAdminStatsService
{
    Task<AdminDashboardStatsDto> GetDashboardStatsAsync(CancellationToken cancellationToken = default);
    Task<SalesSummaryDto> GetSalesSummaryAsync(int months, CancellationToken cancellationToken = default);
}
