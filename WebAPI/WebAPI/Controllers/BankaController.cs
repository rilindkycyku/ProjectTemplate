using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.Services;
using System.Security.Claims;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = "Bearer")]
public class BankaController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAdminLogService _adminLogService;

    public BankaController(ApplicationDbContext context, IAdminLogService adminLogService)
    {
        _context = context;
        _adminLogService = adminLogService;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    [AllowAnonymous]
    [HttpGet("ShfaqBankat")]
    public async Task<IActionResult> ShfaqBankat()
    {
        var bankat = await _context.Bankat.Where(b => b.IsActive).ToListAsync();
        return Ok(bankat);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("ShfaqTeGjithaBankat")]
    public async Task<IActionResult> ShfaqTeGjithaBankat()
    {
        return Ok(await _context.Bankat.ToListAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("ShtoBanken")]
    public async Task<IActionResult> ShtoBanken([FromBody] Banka banka)
    {
        await _context.Bankat.AddAsync(banka);
        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Shto", "Bankat", banka.Id.ToString(), $"U shtua banka: {banka.EmriBankes}");
        }

        return Ok(banka);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("PerditesBanken/{id}")]
    public async Task<IActionResult> PerditesBanken(int id, [FromBody] Banka updated)
    {
        var banka = await _context.Bankat.FindAsync(id);
        if (banka == null) return NotFound();

        banka.EmriBankes = updated.EmriBankes;
        banka.NrLlogaris = updated.NrLlogaris;
        banka.Valuta = updated.Valuta;
        banka.IsActive = updated.IsActive;

        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Ndrysho", "Bankat", banka.Id.ToString(), $"U ndryshua banka: {banka.EmriBankes}");
        }

        return Ok(banka);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("FshijBanken/{id}")]
    public async Task<IActionResult> FshijBanken(int id)
    {
        var banka = await _context.Bankat.FindAsync(id);
        if (banka == null) return NotFound();

        _context.Bankat.Remove(banka);
        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Fshij", "Bankat", id.ToString(), $"U fshi banka: {banka.EmriBankes}");
        }

        return Ok(new { result = true });
    }
}
