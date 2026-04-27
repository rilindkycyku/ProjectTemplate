using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using WebAPI.Models;

namespace WebAPI.Data;

public partial class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }

    public DbSet<Perdoruesi> Perdoruesi { get; set; }
    public DbSet<TeDhenatPerdoruesit> TeDhenatPerdoruesit { get; set; }
    public DbSet<SiteSettings> SiteSettings { get; set; }

    // Invoice module
    public DbSet<Fatura> Faturat { get; set; }
    public DbSet<FaturaArtikujtItem> FaturaArtikujt { get; set; }
    public DbSet<Banka> Bankat { get; set; }
    public DbSet<Klienti> Klientet { get; set; }
}
