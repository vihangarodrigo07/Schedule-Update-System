using Microsoft.EntityFrameworkCore;
using Backend_API.Models;

namespace Backend_API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Lecture> Lectures { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<Hall> Halls { get; set; }
    }
}
