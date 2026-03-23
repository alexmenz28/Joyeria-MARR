using System.ComponentModel.DataAnnotations;

namespace JoyeriaBackend.Models;

/// <summary>Reference catalog for product composition (normalized; replaces free-text material).</summary>
public class Material
{
    public int Id { get; set; }

    [Required]
    [StringLength(120)]
    public required string Name { get; set; }

    /// <summary>Optional fineness or alloy note, e.g. 18K / 925 (for display or future filters).</summary>
    [StringLength(80)]
    public string? AlloyOrFineness { get; set; }
}
