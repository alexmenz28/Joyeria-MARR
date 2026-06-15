using System.Net;
using System.Net.Http.Json;

namespace JoyeriaBackend.Tests;

public class HealthAndAuthTests : IClassFixture<JoyeriaApiFactory>
{
    private readonly HttpClient _client;

    public HealthAndAuthTests(JoyeriaApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_ReturnsHealthy()
    {
        var response = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Register_NormalizesEmail_ToLowerCase()
    {
        var email = $"User{Guid.NewGuid():N}@Example.COM";
        var register = await _client.PostAsJsonAsync("/api/auth/register", new
        {
            name = "Test",
            email,
            password = "Test123!",
            confirmPassword = "Test123!",
        });
        Assert.Equal(HttpStatusCode.OK, register.StatusCode);

        var login = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = email.ToLowerInvariant(),
            password = "Test123!",
        });
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
    }

    [Fact]
    public async Task Customer_CannotListAllOrders()
    {
        var token = await _client.LoginAsCustomerAsync();
        _client.SetBearer(token);

        var response = await _client.GetAsync("/api/orders?page=1&pageSize=10");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_CanListAllOrders()
    {
        var token = await _client.LoginAsAdminAsync();
        _client.SetBearer(token);

        var response = await _client.GetAsync("/api/orders?page=1&pageSize=10");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
