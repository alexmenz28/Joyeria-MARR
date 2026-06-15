using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.DTOs;

public class CreateContactMessageDto
{
    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(4000)]
    public string Message { get; set; } = string.Empty;
}

public class ContactMessageDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}
