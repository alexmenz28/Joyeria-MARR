namespace JoyeriaBackend.DTOs;

/// <summary>Paged list response for large datasets (server-side pagination).</summary>
public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();

    public int TotalCount { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalPages =>
        (int)Math.Ceiling(TotalCount / (double)Math.Max(PageSize, 1));
}
