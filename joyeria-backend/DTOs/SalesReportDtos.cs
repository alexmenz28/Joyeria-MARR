namespace JoyeriaBackend.DTOs;

public class SalesMonthlyPointDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    /// <summary>Short label for charts, e.g. Jan 2025.</summary>
    public string Label { get; set; } = "";
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

public class SalesSummaryDto
{
    public List<SalesMonthlyPointDto> Monthly { get; set; } = new();
    public decimal TotalRevenueInRange { get; set; }
    public int TotalOrdersInRange { get; set; }
    public int Months { get; set; }
    public List<SalesBreakdownDto> ByCategory { get; set; } = new();
    public List<SalesBreakdownDto> ByMaterial { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
}

public class SalesBreakdownDto
{
    public string Name { get; set; } = "";
    public decimal Revenue { get; set; }
    public int UnitsSold { get; set; }
}

public class TopProductDto
{
    public int ProductId { get; set; }
    public string Name { get; set; } = "";
    public int QuantitySold { get; set; }
    public decimal Revenue { get; set; }
}
