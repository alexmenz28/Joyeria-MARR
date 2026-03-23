namespace JoyeriaBackend.DTOs;

/// <summary>Partial update for admin user management.</summary>
public class UpdateUserAdminDto
{
    public int? RoleId { get; set; }
    public bool? IsActive { get; set; }
}
