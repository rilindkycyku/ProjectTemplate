using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = "Bearer")]
public class BankaController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BankaController(ApplicationDbContext context)
    {
        _context = context;
    }

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
        return Ok(new { result = true });
    }
}
