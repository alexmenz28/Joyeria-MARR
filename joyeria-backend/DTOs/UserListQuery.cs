namespace JoyeriaBackend.DTOs;

/// <summary>Query for <c>GET /api/admin/users</c>.</summary>
public class UserListQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
}
