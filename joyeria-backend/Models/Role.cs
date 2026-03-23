using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.Models;

public class Role
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public required string Name { get; set; }
}
