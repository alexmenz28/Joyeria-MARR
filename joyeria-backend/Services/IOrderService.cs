using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;

namespace JoyeriaBackend.Services;

public interface IOrderService
{
    Task<Order?> GetByIdAsync(int id);
    Task<PagedResult<Order>> GetOrdersPagedAsync(OrderListQuery query);
    Task<PagedResult<Order>> GetMyOrdersPagedAsync(int userId, PagedQuery query);
    Task<Order> CreateAsync(Order order);
    Task<Order> CreateOrderForUserAsync(int userId, CreateOrderDto dto);
    Task<Order> UpdateAsync(Order order);
    Task DeleteAsync(int id);
    Task<Order?> UpdateStatusAsync(int id, string statusName);
}
