using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models;

public class Banka
{
    [Key]
    public int Id { get; set; }

    public string? EmriBankes { get; set; }     // Bank name
    public string? NrLlogaris { get; set; }     // Account number / IBAN
    public string? Valuta { get; set; }         // Currency (EUR, USD, CHF...)
    public bool IsActive { get; set; } = true;
}
