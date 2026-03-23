using Microsoft.EntityFrameworkCore;
using JoyeriaBackend.Models;

namespace JoyeriaBackend.Data;

/// <summary>
/// Seeds roles, categories, order statuses, users and sample products when tables are empty.
/// Test password for all three users: <c>Test123!</c>
/// </summary>
public static class DataSeeder
{
    private const string SeedPassword = "Test123!";

    public static async Task SeedAsync(ApplicationDbContext context)
    {
        await SeedRolesAsync(context);
        await SeedCategoriesAsync(context);
        await SeedOrderStatusesAsync(context);
        await SeedUsersAsync(context);
        await SeedProductsAsync(context);
    }

    private static async Task SeedRolesAsync(ApplicationDbContext context)
    {
        if (await context.Roles.AnyAsync())
            return;

        var roles = new[] { "Admin", "Employee", "Customer" }
            .Select(n => new Role { Name = n })
            .ToArray();
        context.Roles.AddRange(roles);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCategoriesAsync(ApplicationDbContext context)
    {
        if (await context.Categories.AnyAsync())
            return;

        var categories = new[] { "Rings", "Necklaces", "Bracelets", "Earrings", "Charms", "Sets", "Other" }
            .Select(n => new Category { Name = n })
            .ToArray();
        context.Categories.AddRange(categories);
        await context.SaveChangesAsync();
    }

    private static async Task SeedOrderStatusesAsync(ApplicationDbContext context)
    {
        if (await context.OrderStatuses.AnyAsync())
            return;

        var statuses = new[] { "Pending", "In Progress", "Completed", "Cancelled" }
            .Select(n => new OrderStatus { Name = n })
            .ToArray();
        context.OrderStatuses.AddRange(statuses);
        await context.SaveChangesAsync();
    }

    private static async Task SeedUsersAsync(ApplicationDbContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin");
        var employeeRole = await context.Roles.FirstAsync(r => r.Name == "Employee");
        var customerRole = await context.Roles.FirstAsync(r => r.Name == "Customer");
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(SeedPassword);

        var users = new[]
        {
            new User
            {
                FirstName = "Admin",
                LastName = "MARR",
                Email = "admin@joyeriamarr.com",
                PasswordHash = passwordHash,
                RoleId = adminRole.Id,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            },
            new User
            {
                FirstName = "Employee",
                LastName = "Test",
                Email = "empleado@joyeriamarr.com",
                PasswordHash = passwordHash,
                RoleId = employeeRole.Id,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            },
            new User
            {
                FirstName = "Customer",
                LastName = "Test",
                Email = "cliente@joyeriamarr.com",
                PasswordHash = passwordHash,
                RoleId = customerRole.Id,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProductsAsync(ApplicationDbContext context)
    {
        if (await context.Products.AnyAsync())
            return;

        var categories = await context.Categories.ToListAsync();
        var catNames = new[] { "Rings", "Necklaces", "Bracelets", "Earrings", "Charms", "Sets" };
        var now = DateTime.UtcNow;
        var products = new List<Product>();
        var materials = new[] { "18K gold", "14K gold", "Sterling silver", "Gold and diamonds", "Silver with cubic zirconia" };

        var names = new[]
        {
            "Classic Solitaire Ring", "Eternity Ring", "Fleur-de-lis Ring", "Art Deco Ring",
            "Heart Necklace", "Pearl Necklace", "Chain Necklace", "Princess Necklace", "Snake Chain Necklace",
            "Tennis Bracelet", "Charm Bracelet", "Infinity Bracelet", "Anklet Bracelet", "Link Bracelet",
            "Classic Stud Earrings", "Drop Earrings", "Hoop Earrings", "Floral Earrings", "Thin Hoop Earrings",
            "Angel Charm", "Heart Charm", "Initial Charm", "Cross Charm", "Infinity Symbol Charm",
            "Bridal Set", "Gala Set", "Everyday Set", "Special Occasion Set"
        };

        for (var i = 0; i < names.Length; i++)
        {
            var catName = catNames[i % catNames.Length];
            var category = categories.First(c => c.Name == catName);
            var mat = materials[i % materials.Length];
            var price = 800m + (i * 120m) % 4200m;
            products.Add(new Product
            {
                Name = names[i],
                Description = $"Exclusive piece from the collection. {mat}. Elegant design for special occasions.",
                Price = price,
                CategoryId = category.Id,
                Material = mat,
                Weight = i % 3 == 0 ? "2.5 g" : i % 3 == 1 ? "4.0 g" : "6.2 g",
                IsAvailable = true,
                Stock = 3 + (i % 5),
                CreatedAt = now,
                UpdatedAt = now
            });
        }

        context.Products.AddRange(products);
        await context.SaveChangesAsync();
    }
}
