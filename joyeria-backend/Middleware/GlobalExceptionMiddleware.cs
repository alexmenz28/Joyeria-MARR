using System.Net;
using System.Text.Json;
using JoyeriaBackend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace JoyeriaBackend.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var (status, code, message) = ex switch
        {
            InvalidOperationException ioe => (HttpStatusCode.BadRequest, "BUSINESS_ERROR", ioe.Message),
            KeyNotFoundException knf => (HttpStatusCode.NotFound, "NOT_FOUND", knf.Message),
            ArgumentException ae => (HttpStatusCode.BadRequest, "VALIDATION_ERROR", ae.Message),
            DbUpdateConcurrencyException => (HttpStatusCode.Conflict, "CONFLICT",
                "The record was modified by another request. Please retry."),
            _ => (HttpStatusCode.InternalServerError, "INTERNAL_ERROR", "An unexpected error occurred."),
        };

        if (status == HttpStatusCode.InternalServerError)
            _logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
        else
            _logger.LogWarning(ex, "{Code}: {Message}", code, message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var body = new ApiErrorResponse { Error = message, Code = code };
        await context.Response.WriteAsync(JsonSerializer.Serialize(body));
    }
}
