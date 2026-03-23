namespace JoyeriaBackend.DTOs;

/// <summary>Minimal pagination query (e.g. <c>GET /api/orders/my</c>). Page size clamped server-side.</summary>
public class PagedQuery
{
    public int Page { get; set; } = 1;

    /// <summary>Clamped server-side (max 100).</summary>
    public int PageSize { get; set; } = 10;
}
