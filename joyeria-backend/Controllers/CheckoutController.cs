using JoyeriaBackend.DTOs;
using JoyeriaBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JoyeriaBackend.Controllers;

[ApiController]
[Route("api/checkout")]
public class CheckoutController : ControllerBase
{
    private readonly ICheckoutPricingService _pricing;

    public CheckoutController(ICheckoutPricingService pricing)
    {
        _pricing = pricing;
    }

    [HttpPost("quote")]
    [AllowAnonymous]
    public ActionResult<CheckoutQuoteDto> Quote([FromBody] CheckoutQuoteRequestDto dto)
    {
        if (dto.Subtotal < 0)
            return BadRequest(new { error = "Invalid subtotal.", code = "INVALID_SUBTOTAL" });

        var quote = _pricing.Quote(dto.Subtotal, dto.Shipping);
        return Ok(quote);
    }
}
