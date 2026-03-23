using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.DTOs;

public class UpdateOrderStatusDto
{
    [Required(ErrorMessage = "Status is required.")]
    public string Status { get; set; } = string.Empty;
}
