using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace JoyeriaBackend.Tests;

public class JoyeriaApiFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
    {
        builder.UseSetting("ASPNETCORE_ENVIRONMENT", "Development");
        builder.UseSetting("UseInMemoryDatabase", "true");
        builder.UseSetting("InMemoryDatabaseName", _dbName);

        builder.UseSetting("JwtSettings:Key", "integration-test-secret-key-32chars!");
        builder.UseSetting("JwtSettings:Issuer", "TestIssuer");
        builder.UseSetting("JwtSettings:Audience", "TestAudience");
        builder.UseSetting("JwtSettings:DurationInMinutes", "60");
        builder.UseSetting("CloudinarySettings:CloudName", "test");
        builder.UseSetting("CloudinarySettings:ApiKey", "123456789012345");
        builder.UseSetting("CloudinarySettings:ApiSecret", "test-secret");
    }
}

public static class TestHttpClientExtensions
{
    public static async Task<string> LoginAsAdminAsync(this HttpClient client)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "admin@joyeriamarr.com",
            password = "Test123!",
        });
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("token").GetString()!;
    }

    public static async Task<string> LoginAsCustomerAsync(this HttpClient client)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "cliente@joyeriamarr.com",
            password = "Test123!",
        });
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("token").GetString()!;
    }

    public static void SetBearer(this HttpClient client, string token) =>
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
}
