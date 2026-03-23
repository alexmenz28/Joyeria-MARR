using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.DTOs;

public class CreateOrderDto
{
    [StringLength(2000)]
    public string? Notes { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "At least one line item is required.")]
    public List<CreateOrderLineDto> Lines { get; set; } = new();
}
