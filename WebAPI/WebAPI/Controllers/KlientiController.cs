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
public class KlientiController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IAdminLogService _adminLogService;

    public KlientiController(ApplicationDbContext context, IAdminLogService adminLogService)
    {
        _context = context;
        _adminLogService = adminLogService;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    [HttpGet("ShfaqKlientet")]
    public async Task<IActionResult> ShfaqKlientet()
    {
        return Ok(await _context.Klientet.ToListAsync());
    }

    [HttpPost("ShtoKlientin")]
    public async Task<IActionResult> ShtoKlientin([FromBody] Klienti klienti)
    {
        await _context.Klientet.AddAsync(klienti);
        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Shto", "Klientet", klienti.Id.ToString(), $"U shtua klienti: {klienti.EmriKompanise}");
        }

        return Ok(klienti);
    }

    [HttpPut("PerditesoKlientin/{id}")]
    public async Task<IActionResult> PerditesoKlientin(int id, [FromBody] Klienti updated)
    {
        var klienti = await _context.Klientet.FindAsync(id);
        if (klienti == null) return NotFound();

        klienti.EmriKompanise = updated.EmriKompanise;
        klienti.Adresa = updated.Adresa;
        klienti.Telefoni = updated.Telefoni;
        klienti.Email = updated.Email;
        klienti.NUI = updated.NUI;
        klienti.NRB = updated.NRB;

        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Ndrysho", "Klientet", klienti.Id.ToString(), $"U ndryshua klienti: {klienti.EmriKompanise}");
        }

        return Ok(klienti);
    }

    [HttpDelete("FshijKlientin/{id}")]
    public async Task<IActionResult> FshijKlientin(int id)
    {
        var klienti = await _context.Klientet.FindAsync(id);
        if (klienti == null) return NotFound();

        _context.Klientet.Remove(klienti);
        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Fshij", "Klientet", id.ToString(), $"U fshi klienti: {klienti.EmriKompanise}");
        }

        return Ok(new { result = true });
    }
}
