using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace JoyeriaBackend.Services;

public class FileValidationService : IFileValidationService
{
    private readonly long _maxBytes;
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    };

    public FileValidationService(IConfiguration configuration)
    {
        var mb = configuration.GetValue("FileUpload:MaxSizeMb", 5);
        _maxBytes = mb * 1024L * 1024L;
    }

    public void ValidateImage(IFormFile file)
    {
        if (file.Length == 0)
            throw new ArgumentException("Image cannot be empty.");

        if (file.Length > _maxBytes)
            throw new ArgumentException($"Image must not exceed {_maxBytes / 1024 / 1024} MB.");

        if (!AllowedContentTypes.Contains(file.ContentType))
            throw new ArgumentException("Invalid image type. Allowed: JPEG, PNG, WebP, GIF.");
    }
}
