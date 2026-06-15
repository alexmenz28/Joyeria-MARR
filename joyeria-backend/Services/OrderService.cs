using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Mapping;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace JoyeriaBackend.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OrderService> _logger;

    public OrderService(ApplicationDbContext context, ILogger<OrderService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<OrderDetailDto?> GetByIdAsync(int id)
    {
        var order = await OrderDetailQuery().FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
            return null;

        await HydrateLineProductsAsync([order]);
        return order.ToDetailDto();
    }

    public async Task<PagedResult<OrderSummaryDto>> GetOrdersPagedAsync(OrderListQuery q)
    {
        var pageSize = Math.Clamp(q.PageSize, 1, 100);
        var baseQuery = _context.Orders
            .Include(o => o.OrderStatus)
            .Include(o => o.User)
            .ThenInclude(u => u.Role)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(q.Search))
        {
            var s = q.Search.Trim();
            if (int.TryParse(s, out var orderId))
            {
                baseQuery = baseQuery.Where(o =>
                    o.Id == orderId ||
                    o.User.Email.Contains(s) ||
                    o.User.FirstName.Contains(s) ||
                    o.User.LastName.Contains(s));
            }
            else
            {
                baseQuery = baseQuery.Where(o =>
                    o.User.Email.Contains(s) ||
                    o.User.FirstName.Contains(s) ||
                    o.User.LastName.Contains(s));
            }
        }

        var totalCount = await baseQuery.CountAsync();
        var totalPages = Math.Max(1, (int)Math.Ceiling(totalCount / (double)pageSize));
        var page = Math.Clamp(q.Page < 1 ? 1 : q.Page, 1, totalPages);
        if (totalCount == 0)
            page = 1;

        var items = await baseQuery
            .OrderByDescending(o => o.OrderedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<OrderSummaryDto>
        {
            Items = items.Select(o => o.ToSummaryDto()).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<PagedResult<OrderDetailDto>> GetMyOrdersPagedAsync(int userId, PagedQuery q)
    {
        var pageSize = Math.Clamp(q.PageSize, 1, 100);
        var filtered = _context.Orders.Where(o => o.UserId == userId);

        var totalCount = await filtered.CountAsync();
        var totalPages = Math.Max(1, (int)Math.Ceiling(totalCount / (double)pageSize));
        var page = Math.Clamp(q.Page < 1 ? 1 : q.Page, 1, totalPages);
        if (totalCount == 0)
            page = 1;

        var items = await filtered
            .Include(o => o.OrderStatus)
            .Include(o => o.Lines)
            .ThenInclude(l => l.Product!)
            .ThenInclude(p => p.Category)
            .Include(o => o.Lines)
            .ThenInclude(l => l.Product!)
            .ThenInclude(p => p.MaterialEntity)
            .OrderByDescending(o => o.OrderedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        await HydrateLineProductsAsync(items);

        return new PagedResult<OrderDetailDto>
        {
            Items = items.Select(o => o.ToDetailDto()).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<OrderDetailDto> CreateOrderForUserAsync(int userId, CreateOrderDto dto)
    {
        if (dto.Lines.Count == 0)
            throw new InvalidOperationException("Order must contain at least one line.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            throw new InvalidOperationException("User not found.");

        var pending = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.Name == OrderStatusNames.Pending)
            ?? throw new InvalidOperationException("Order status 'Pending' is not configured.");

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            decimal total = 0;
            var lines = new List<OrderLine>();
            var touchedProducts = new List<Product>();

            foreach (var item in dto.Lines)
            {
                var isCatalog = item.ProductId.HasValue && item.ProductId.Value > 0;

                if (isCatalog)
                {
                    if (!string.IsNullOrWhiteSpace(item.CustomDescription))
                        throw new InvalidOperationException("Catalog lines cannot include a custom description.");

                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId!.Value)
                        ?? throw new InvalidOperationException($"Product {item.ProductId} was not found.");

                    if (!product.IsAvailable)
                        throw new InvalidOperationException($"Product '{product.Name}' is not available.");
                    if (product.Stock < item.Quantity)
                        throw new InvalidOperationException($"Insufficient stock for '{product.Name}'.");

                    product.Stock -= item.Quantity;
                    product.StockVersion++;
                    product.UpdatedAt = DateTime.UtcNow;
                    touchedProducts.Add(product);

                    total += product.Price * item.Quantity;
                    lines.Add(new OrderLine
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                    });
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(item.CustomDescription))
                        throw new InvalidOperationException("Custom order lines require a description.");

                    lines.Add(new OrderLine
                    {
                        ProductId = null,
                        Quantity = item.Quantity,
                        UnitPrice = 0,
                        CustomDescription = item.CustomDescription.Trim(),
                    });
                }
            }

            var order = new Order
            {
                UserId = userId,
                OrderStatusId = pending.Id,
                Notes = dto.Notes,
                Total = total,
                OrderedAt = DateTime.UtcNow,
                Lines = lines,
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return (await GetByIdAsync(order.Id))!;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            await transaction.RollbackAsync();
            _logger.LogWarning(ex, "Concurrency conflict creating order for user {UserId}", userId);
            throw new InvalidOperationException("Stock was updated by another request. Please retry.");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderStatus)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
            return false;

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            if (order.OrderStatus.Name != OrderStatusNames.Cancelled)
                await RestoreStockForOrderAsync(id);

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<OrderDetailDto?> UpdateStatusAsync(int id, string statusName)
    {
        var order = await _context.Orders
            .Include(o => o.OrderStatus)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null)
            return null;

        var status = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.Name == statusName);
        if (status == null)
            return null;

        var oldStatus = order.OrderStatus.Name;
        if (oldStatus == statusName)
            return await GetByIdAsync(id);

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            if (statusName == OrderStatusNames.Cancelled && oldStatus != OrderStatusNames.Cancelled)
                await RestoreStockForOrderAsync(id);

            order.OrderStatusId = status.Id;
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return await GetByIdAsync(id);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private async Task RestoreStockForOrderAsync(int orderId)
    {
        var lines = await _context.OrderLines
            .Where(l => l.OrderId == orderId && l.ProductId != null)
            .ToListAsync();

        foreach (var line in lines)
        {
            var product = await _context.Products
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == line.ProductId);
            if (product == null)
                continue;

            product.Stock += line.Quantity;
            product.StockVersion++;
            product.UpdatedAt = DateTime.UtcNow;
        }
    }

    private async Task HydrateLineProductsAsync(IEnumerable<Order> orders)
    {
        var linesNeedingProduct = orders
            .SelectMany(o => o.Lines)
            .Where(l => l.ProductId != null && l.Product == null)
            .ToList();

        if (linesNeedingProduct.Count == 0)
            return;

        var productIds = linesNeedingProduct.Select(l => l.ProductId!.Value).Distinct().ToList();
        var products = await _context.Products.IgnoreQueryFilters()
            .Include(p => p.Category)
            .Include(p => p.MaterialEntity)
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        foreach (var line in linesNeedingProduct)
        {
            if (line.ProductId != null && products.TryGetValue(line.ProductId.Value, out var product))
                line.Product = product;
        }
    }

    private IQueryable<Order> OrderDetailQuery() =>
        _context.Orders
            .Include(o => o.OrderStatus)
            .Include(o => o.Lines)
            .ThenInclude(l => l.Product!)
            .ThenInclude(p => p.Category)
            .Include(o => o.Lines)
            .ThenInclude(l => l.Product!)
            .ThenInclude(p => p.MaterialEntity)
            .Include(o => o.User)
            .ThenInclude(u => u.Role);
}
