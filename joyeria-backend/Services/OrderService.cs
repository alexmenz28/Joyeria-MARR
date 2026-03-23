using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.OrderStatus)
            .Include(o => o.Lines)
            .ThenInclude(l => l.Product!)
            .ThenInclude(p => p.Category)
            .Include(o => o.Lines)
            .ThenInclude(l => l.Product!)
            .ThenInclude(p => p.MaterialEntity)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<PagedResult<Order>> GetOrdersPagedAsync(OrderListQuery q)
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

        return new PagedResult<Order>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<PagedResult<Order>> GetMyOrdersPagedAsync(int userId, PagedQuery q)
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

        return new PagedResult<Order>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<Order> CreateAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<Order> CreateOrderForUserAsync(int userId, CreateOrderDto dto)
    {
        if (dto.Lines.Count == 0)
            throw new InvalidOperationException("Order must contain at least one line.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            throw new InvalidOperationException("User not found.");

        var pending = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.Name == "Pending")
            ?? throw new InvalidOperationException("Order status 'Pending' is not configured.");

        decimal total = 0;
        var lines = new List<OrderLine>();

        foreach (var item in dto.Lines)
        {
            var isCatalog = item.ProductId.HasValue && item.ProductId.Value > 0;

            if (isCatalog)
            {
                if (!string.IsNullOrWhiteSpace(item.CustomDescription))
                    throw new InvalidOperationException("Catalog lines cannot include a custom description.");

                var product = await _context.Products.FindAsync(item.ProductId!.Value)
                    ?? throw new InvalidOperationException($"Product {item.ProductId} was not found.");

                if (!product.IsAvailable)
                    throw new InvalidOperationException($"Product '{product.Name}' is not available.");
                if (product.Stock < item.Quantity)
                    throw new InvalidOperationException($"Insufficient stock for '{product.Name}'.");

                product.Stock -= item.Quantity;
                product.UpdatedAt = DateTime.UtcNow;

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

        return (await GetByIdAsync(order.Id))!;
    }

    public async Task<Order> UpdateAsync(Order order)
    {
        _context.Entry(order).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task DeleteAsync(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order != null)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Order?> UpdateStatusAsync(int id, string statusName)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            return null;

        var status = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.Name == statusName);
        if (status == null)
            return null;

        order.OrderStatusId = status.Id;
        _context.Entry(order).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return await GetByIdAsync(order.Id);
    }
}
