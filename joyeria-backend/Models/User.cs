using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace JoyeriaBackend.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    public required string FirstName { get; set; }

    [Required]
    public required string LastName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    /// <summary>Never serialized to JSON. Not marked <c>required</c> to avoid a System.Text.Json contract error with <see cref="JsonIgnoreAttribute"/> (.NET 9+).</summary>
    [Required]
    [JsonIgnore]
    public string PasswordHash { get; set; } = null!;

    [Required]
    public int RoleId { get; set; }

    [ForeignKey("RoleId")]
    public Role Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
