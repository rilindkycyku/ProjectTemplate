using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models;

public class FaturaArtikujtItem
{
    [Key]
    public int Id { get; set; }

    public int FaturaId { get; set; }

    [ForeignKey("FaturaId")]
    public virtual Fatura Fatura { get; set; } = null!;

    public string? Kodi { get; set; }           // Item code / SKU
    public string? Emri { get; set; }           // Item name
    public string? Njesia { get; set; }         // Unit of measure (kg, pc, L...)

    [Column(TypeName = "decimal(18,4)")]
    public decimal Sasia { get; set; }          // Quantity

    [Column(TypeName = "decimal(18,4)")]
    public decimal Cmimi { get; set; }          // Price with VAT included

    [Column(TypeName = "decimal(18,4)")]
    public decimal Rabati1 { get; set; }        // Discount 1 (%)

    [Column(TypeName = "decimal(18,4)")]
    public decimal Rabati2 { get; set; }        // Discount 2 (%)

    [Column(TypeName = "decimal(18,4)")]
    public decimal Rabati3 { get; set; }        // Discount 3 (%)

    [Column(TypeName = "decimal(18,4)")]
    public decimal Tvsh { get; set; }           // VAT rate (%)
}
