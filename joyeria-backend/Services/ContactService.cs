using JoyeriaBackend.Data;
using JoyeriaBackend.DTOs;
using JoyeriaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Services;

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _context;

    public ContactService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ContactMessageDto> CreateAsync(CreateContactMessageDto dto)
    {
        var entity = new ContactMessage
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Message = dto.Message.Trim(),
            CreatedAt = DateTime.UtcNow,
            IsRead = false,
        };

        _context.ContactMessages.Add(entity);
        await _context.SaveChangesAsync();
        return ToDto(entity);
    }

    public async Task<PagedResult<ContactMessageDto>> GetPagedAsync(PagedQuery query)
    {
        var pageSize = Math.Clamp(query.PageSize, 1, 100);
        var totalCount = await _context.ContactMessages.CountAsync();
        var totalPages = Math.Max(1, (int)Math.Ceiling(totalCount / (double)pageSize));
        var page = Math.Clamp(query.Page < 1 ? 1 : query.Page, 1, totalPages);
        if (totalCount == 0)
            page = 1;

        var items = await _context.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<ContactMessageDto>
        {
            Items = items.Select(ToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    public async Task<bool> MarkReadAsync(int id)
    {
        var msg = await _context.ContactMessages.FirstOrDefaultAsync(m => m.Id == id);
        if (msg == null)
            return false;

        msg.IsRead = true;
        await _context.SaveChangesAsync();
        return true;
    }

    private static ContactMessageDto ToDto(ContactMessage m) => new()
    {
        Id = m.Id,
        Name = m.Name,
        Email = m.Email,
        Message = m.Message,
        CreatedAt = m.CreatedAt,
        IsRead = m.IsRead,
    };
}
