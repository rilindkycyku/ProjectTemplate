using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Services;

public class AdminLogService : IAdminLogService
{
    private readonly ApplicationDbContext _context;

    public AdminLogService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task LogAsync(string userId, string veprimi, string entiteti, string entitetiId, string detaje)
    {
        var stafi = await _context.Perdoruesi.Where(x => x.Email == userId).FirstOrDefaultAsync();

        if (stafi == null)
        {
            throw new Exception("User not found");
        }

        var log = new AdminLogs
        {
            StafiId = stafi.UserId,
            Veprimi = veprimi,
            Entiteti = entiteti,
            EntitetiId = entitetiId,
            Koha = DateTime.UtcNow,
            Detaje = detaje
        };

        _context.AdminLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
