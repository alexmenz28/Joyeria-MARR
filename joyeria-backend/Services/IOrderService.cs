using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;

namespace JoyeriaBackend.Services;

public interface IOrderService
{
    Task<OrderDetailDto?> GetByIdAsync(int id);
    Task<PagedResult<OrderSummaryDto>> GetOrdersPagedAsync(OrderListQuery query);
    Task<PagedResult<OrderDetailDto>> GetMyOrdersPagedAsync(int userId, PagedQuery query);
    Task<OrderDetailDto> CreateOrderForUserAsync(int userId, CreateOrderDto dto);
    Task<bool> DeleteAsync(int id);
    Task<OrderDetailDto?> UpdateStatusAsync(int id, string statusName);
}
