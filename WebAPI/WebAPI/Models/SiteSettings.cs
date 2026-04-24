using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class SiteSettings
{
    [Key]
    public int Id { get; set; }

    // Branding
    public string? SiteEmri { get; set; }       // Site name / brand name
    public string? Logo { get; set; }            // filename of logo image
    public string? Pershkrimi { get; set; }      // Footer premium description

    // Contact
    public string? Email { get; set; }
    public string? Telefoni { get; set; }
    public string? Adresa { get; set; }

    // Social links
    public string? Facebook { get; set; }
    public string? Instagram { get; set; }
    public string? Twitter { get; set; }
    public string? GitHub { get; set; }
    public string? LinkedIn { get; set; }
}
