using System.Net;
using System.Net.Http.Json;
using JoyeriaBackend.Data;
using JoyeriaBackend.Models;
using Microsoft.Extensions.DependencyInjection;

namespace JoyeriaBackend.Tests;

public class OrderStockTests : IClassFixture<JoyeriaApiFactory>
{
    private readonly JoyeriaApiFactory _factory;
    private readonly HttpClient _client;

    public OrderStockTests(JoyeriaApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateOrder_DecrementsStock_AndCancelRestores()
    {
        int productId;
        int initialStock;

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var product = db.Products.First();
            productId = product.Id;
            initialStock = product.Stock;
        }

        var token = await _client.LoginAsCustomerAsync();
        _client.SetBearer(token);

        var create = await _client.PostAsJsonAsync("/api/orders", new
        {
            notes = "test order",
            shipping = new
            {
                street = "123 Test St",
                city = "Mexico City",
                state = "CDMX",
                postalCode = "01000",
                country = "MX",
            },
            lines = new[] { new { productId, quantity = 1 } },
        });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var order = await create.Content.ReadFromJsonAsync<JsonOrder>();
        Assert.NotNull(order);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var product = await db.Products.FindAsync(productId);
            Assert.Equal(initialStock - 1, product!.Stock);
        }

        var adminToken = await _client.LoginAsAdminAsync();
        _client.SetBearer(adminToken);

        var patch = await _client.PatchAsJsonAsync($"/api/orders/{order!.Id}/status", new { status = OrderStatusNames.Cancelled });
        Assert.Equal(HttpStatusCode.OK, patch.StatusCode);

        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var product = await db.Products.FindAsync(productId);
            Assert.Equal(initialStock, product!.Stock);
        }
    }

    private sealed class JsonOrder
    {
        public int Id { get; set; }
    }
}
