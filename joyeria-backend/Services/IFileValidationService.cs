using Microsoft.AspNetCore.Http;

namespace JoyeriaBackend.Services;

public interface IFileValidationService
{
    void ValidateImage(IFormFile file);
}
