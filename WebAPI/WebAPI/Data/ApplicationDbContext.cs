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

        // Seed a single default SiteSettings row
        builder.Entity<SiteSettings>().HasData(new SiteSettings
        {
            Id = 1,
            SiteEmri = "Project Template",
            Logo = null,
            Pershkrimi = "A premium starting point for your next big idea. Built with efficiency, scalability, and modern best practices in mind.",
            Email = "contact@template.com",
            Telefoni = "+383 44 000 000",
            Adresa = "Prishtine, Kosove",
            Facebook = "#",
            Instagram = "#",
            Twitter = "#",
            GitHub = "#",
            LinkedIn = "#",
        });
    }

    public DbSet<Perdoruesi> Perdoruesi { get; set; }
    public DbSet<TeDhenatPerdoruesit> TeDhenatPerdoruesit { get; set; }
    public DbSet<SiteSettings> SiteSettings { get; set; }
}
