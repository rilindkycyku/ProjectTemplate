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
public class SiteSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly IAdminLogService _adminLogService;

    public SiteSettingsController(ApplicationDbContext context, IWebHostEnvironment env, IAdminLogService adminLogService)
    {
        _context = context;
        _env = env;
        _adminLogService = adminLogService;
    }

    private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    // GET - public, no auth needed (navbar/footer need it)
    [HttpGet]
    [Route("ShfaqCilesimet")]
    public async Task<IActionResult> ShfaqCilesimet()
    {
        var settings = await _context.SiteSettings.FirstOrDefaultAsync();
        if (settings == null) return NotFound();
        return Ok(settings);
    }

    // PUT - admin only, update text fields
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    [HttpPut]
    [Route("PerditesCilesimet")]
    public async Task<IActionResult> PerditesCilesimet([FromBody] SiteSettings updated)
    {
        var settings = await _context.SiteSettings.FirstOrDefaultAsync();
        if (settings == null) return NotFound();

        settings.SiteEmri = updated.SiteEmri;
        settings.Pershkrimi = updated.Pershkrimi;
        settings.Email = updated.Email;
        settings.Telefoni = updated.Telefoni;
        settings.Adresa = updated.Adresa;
        settings.Facebook = updated.Facebook;
        settings.Instagram = updated.Instagram;
        settings.Twitter = updated.Twitter;
        settings.GitHub = updated.GitHub;
        settings.LinkedIn = updated.LinkedIn;

        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Ndrysho", "Cilesimet e Sajtit", settings.Id.ToString(), "U përditësuan cilësimet e platformës.");
        }

        return Ok(settings);
    }

    // POST - admin only, upload logo image
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    [HttpPost]
    [Route("NgarkoLogo")]
    public async Task<IActionResult> NgarkoLogo(IFormFile logo)
    {
        if (logo == null || logo.Length == 0)
            return BadRequest("Ju lutem vendosni foton.");

        // Allowed types
        var allowed = new[] { ".png", ".jpg", ".jpeg", ".svg", ".webp" };
        var ext = Path.GetExtension(logo.FileName).ToLower();
        if (!allowed.Contains(ext))
            return BadRequest("Tipi i fotos nuk është i lejuar.");

        var settings = await _context.SiteSettings.FirstOrDefaultAsync();
        if (settings == null) return NotFound();

        // Delete old logo if it exists
        var follderi = Path.Combine("..", "..", "frontend", "public", "img", "web");
        
        if (!string.IsNullOrEmpty(settings.Logo) && settings.Logo != "PaLogo.png")
        {
            var oldPath = Path.Combine(follderi, settings.Logo);
            if (System.IO.File.Exists(oldPath))
                System.IO.File.Delete(oldPath);
        }

        // Save new logo
        Directory.CreateDirectory(follderi);

        var uniqueName = Guid.NewGuid().ToString("N") + ext;
        var savePath = Path.Combine(follderi, uniqueName);

        using (var stream = new FileStream(savePath, FileMode.Create))
            await logo.CopyToAsync(stream);

        settings.Logo = uniqueName;
        await _context.SaveChangesAsync();

        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            await _adminLogService.LogAsync(userId, "Ndrysho", "Cilesimet e Sajtit", settings.Id.ToString(), "U ndryshua logo e platformës.");
        }

        return Ok(new { logo = uniqueName });
    }
}
