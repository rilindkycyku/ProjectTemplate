using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = "Bearer")]
public class FaturaController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FaturaController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FATURAT (Invoice headers)
    // ─────────────────────────────────────────────────────────────────────────

    /// <summary>GET all invoices (Admin/Menaxher only). Excludes items for performance.</summary>
    [Authorize(Roles = "Admin, Menaxher")]
    [HttpGet("ShfaqFaturat")]
    public async Task<IActionResult> ShfaqFaturat()
    {
        var faturat = await _context.Faturat
            .OrderByDescending(f => f.DataRegjistrimit)
            .ToListAsync();

        return Ok(faturat);
    }

    /// <summary>GET a single invoice with its line items.</summary>
    [HttpGet("ShfaqFaturen/{id}")]
    public async Task<IActionResult> ShfaqFaturen(int id)
    {
        var fatura = await _context.Faturat
            .Include(f => f.Artikujt)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (fatura == null)
            return NotFound("Fatura nuk u gjet.");

        return Ok(fatura);
    }

    /// <summary>POST create a new invoice with its line items.</summary>
    [Authorize(Roles = "Admin, Menaxher, User")]
    [HttpPost("ShtoFaturen")]
    public async Task<IActionResult> ShtoFaturen([FromBody] FaturaCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Auto-generate NrFatures if not provided
        var nrFatures = dto.NrFatures;
        if (string.IsNullOrWhiteSpace(nrFatures))
        {
            var sot = DateTime.UtcNow;
            var rendor = await _context.Faturat.CountAsync() + 1;
            nrFatures = $"FAT-{sot:ddMMyy}-{rendor:D4}";
        }

        // Compute totals from items
        decimal totaliMeTVSH = 0, totaliPaTVSH = 0, tvsh8 = 0, tvsh18 = 0, rabati = 0;
        foreach (var item in dto.Artikujt)
        {
            var totalRabat = (item.Rabati1 + item.Rabati2 + item.Rabati3) / 100m;
            var cmimiMeRabat = item.Cmimi * (1 - totalRabat);
            var tvshRate = item.Tvsh / 100m;
            var cmimiPaTvsh = item.Cmimi / (1 + tvshRate);
            var tvshVlera = cmimiMeRabat * tvshRate * item.Sasia;
            var shuma = cmimiMeRabat * item.Sasia;
            var shumaPaTvsh = (cmimiPaTvsh * (1 - totalRabat)) * item.Sasia;

            totaliMeTVSH += shuma;
            totaliPaTVSH += shumaPaTvsh;
            rabati += item.Cmimi * totalRabat * item.Sasia;

            if (item.Tvsh == 8m) tvsh8 += tvshVlera;
            else if (item.Tvsh == 18m) tvsh18 += tvshVlera;
        }

        var fatura = new Fatura
        {
            NrFatures = nrFatures,
            Titulli = dto.Titulli ?? "FATURE",
            DataRegjistrimit = dto.DataRegjistrimit ?? DateTime.UtcNow,
            Shenime = dto.Shenime,
            KlientiEmri = dto.KlientiEmri,
            KlientiAdresa = dto.KlientiAdresa,
            KlientiEmail = dto.KlientiEmail,
            KlientiTelefoni = dto.KlientiTelefoni,
            TotaliMeTVSH = Math.Round(totaliMeTVSH, 2),
            TotaliPaTVSH = Math.Round(totaliPaTVSH, 2),
            TVSH8 = Math.Round(tvsh8, 2),
            TVSH18 = Math.Round(tvsh18, 2),
            Rabati = Math.Round(rabati, 2),
            AspNetUserId = dto.AspNetUserId,
            KlientiId = dto.KlientiId,
            Artikujt = dto.Artikujt.Select(a => new FaturaArtikujtItem
            {
                Kodi = a.Kodi,
                Emri = a.Emri,
                Njesia = a.Njesia,
                Sasia = a.Sasia,
                Cmimi = a.Cmimi,
                Rabati1 = a.Rabati1,
                Rabati2 = a.Rabati2,
                Rabati3 = a.Rabati3,
                Tvsh = a.Tvsh,
            }).ToList()
        };

        await _context.Faturat.AddAsync(fatura);
        await _context.SaveChangesAsync();

        return Ok(fatura);
    }

    /// <summary>DELETE an invoice and its items (Admin only).</summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("FshijFaturen/{id}")]
    public async Task<IActionResult> FshijFaturen(int id)
    {
        var fatura = await _context.Faturat
            .Include(f => f.Artikujt)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (fatura == null)
            return NotFound("Fatura nuk u gjet.");

        _context.FaturaArtikujt.RemoveRange(fatura.Artikujt);
        _context.Faturat.Remove(fatura);
        await _context.SaveChangesAsync();

        return Ok(new { result = true });
    }

    // (Bankat endpoints moved to BankaController)
}

// ─────────────────────────────────────────────────────────────────────────────
// DTOs
// ─────────────────────────────────────────────────────────────────────────────

public class FaturaCreateDto
{
    public string? NrFatures { get; set; }
    public string? Titulli { get; set; }
    public DateTime? DataRegjistrimit { get; set; }
    public string? Shenime { get; set; }
    public string? KlientiEmri { get; set; }
    public string? KlientiAdresa { get; set; }
    public string? KlientiEmail { get; set; }
    public string? KlientiTelefoni { get; set; }
    public string? AspNetUserId { get; set; }
    public int? KlientiId { get; set; }
    public List<ArtikullDto> Artikujt { get; set; } = new();
}

public class ArtikullDto
{
    public string? Kodi { get; set; }
    public string? Emri { get; set; }
    public string? Njesia { get; set; }
    public decimal Sasia { get; set; }
    public decimal Cmimi { get; set; }
    public decimal Rabati1 { get; set; }
    public decimal Rabati2 { get; set; }
    public decimal Rabati3 { get; set; }
    public decimal Tvsh { get; set; }
}
