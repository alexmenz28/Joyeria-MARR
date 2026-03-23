namespace JoyeriaBackend.DTOs;

/// <summary>Query parameters for <c>GET /api/products</c> (paged catalog / admin).</summary>
public class ProductListQuery
{
    public int Page { get; set; } = 1;

    /// <summary>Clamped server-side (max 100).</summary>
    public int PageSize { get; set; } = 20;

    public string? Search { get; set; }

    /// <summary>Exact category name (e.g. Rings).</summary>
    public string? Category { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    /// <summary>When true, only products that are available or have stock.</summary>
    public bool? InStockOnly { get; set; }

    /// <summary>relevance | price-asc | price-desc | name-asc | name-desc | newest</summary>
    public string? SortBy { get; set; }
}
