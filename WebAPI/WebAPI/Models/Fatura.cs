using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models;

public class Fatura
{
    [Key]
    public int Id { get; set; }

    // Invoice identity
    public string? NrFatures { get; set; }         // Invoice reference number
    public string? Titulli { get; set; }            // e.g. "FATURE", "OFERTE", "PARAGON"
    public DateTime DataRegjistrimit { get; set; } = DateTime.UtcNow;
    public string? Shenime { get; set; }            // Additional notes

    // Client info
    public string? KlientiEmri { get; set; }
    public string? KlientiAdresa { get; set; }
    public string? KlientiEmail { get; set; }
    public string? KlientiTelefoni { get; set; }

    // Totals (pre-computed and stored for PDF accuracy)
    [Column(TypeName = "decimal(18,2)")]
    public decimal TotaliMeTVSH { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotaliPaTVSH { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TVSH8 { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TVSH18 { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Rabati { get; set; }

    // Who created it (AspNetUser Id)
    public string? AspNetUserId { get; set; }

    // Foreign key to Klienti
    public int? KlientiId { get; set; }
    [ForeignKey("KlientiId")]
    public virtual Klienti? Klienti { get; set; }

    // Navigation
    public virtual ICollection<FaturaArtikujtItem> Artikujt { get; set; } = new List<FaturaArtikujtItem>();
}
