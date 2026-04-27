using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = "Bearer")]
public class KlientiController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public KlientiController(ApplicationDbContext context)
    {
        _context = context;
    }

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
        return Ok(klienti);
    }

    [HttpDelete("FshijKlientin/{id}")]
    public async Task<IActionResult> FshijKlientin(int id)
    {
        var klienti = await _context.Klientet.FindAsync(id);
        if (klienti == null) return NotFound();

        _context.Klientet.Remove(klienti);
        await _context.SaveChangesAsync();
        return Ok(new { result = true });
    }
}
