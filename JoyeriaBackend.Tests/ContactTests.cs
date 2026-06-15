using System.Net;
using System.Net.Http.Json;

namespace JoyeriaBackend.Tests;

public class ContactTests : IClassFixture<JoyeriaApiFactory>
{
    private readonly HttpClient _client;

    public ContactTests(JoyeriaApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Contact_Create_PersistsMessage()
    {
        var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "Jane Doe",
            email = "jane@example.com",
            message = "I would like a custom ring.",
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var token = await _client.LoginAsAdminAsync();
        _client.SetBearer(token);

        var list = await _client.GetFromJsonAsync<PagedContactResult>("/api/admin/contact-messages?page=1&pageSize=10");
        Assert.NotNull(list);
        Assert.Contains(list!.Items, m => m.Email == "jane@example.com");
    }

    [Fact]
    public async Task Customer_CannotListContactMessages()
    {
        var token = await _client.LoginAsCustomerAsync();
        _client.SetBearer(token);

        var response = await _client.GetAsync("/api/admin/contact-messages?page=1&pageSize=10");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private sealed class PagedContactResult
    {
        public List<ContactItem> Items { get; set; } = [];
    }

    private sealed class ContactItem
    {
        public string Email { get; set; } = "";
    }
}
