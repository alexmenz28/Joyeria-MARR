using JoyeriaBackend.DTOs;

namespace JoyeriaBackend.Services;

public interface IContactService
{
    Task<ContactMessageDto> CreateAsync(CreateContactMessageDto dto);
    Task<PagedResult<ContactMessageDto>> GetPagedAsync(PagedQuery query);
    Task<bool> MarkReadAsync(int id);
}
