﻿using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
  public class DataContext : IdentityDbContext<AppUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Value> Values { get; set; }
    public DbSet<Activity> Activities { get; set; }
    // defines table of UserActivites
    public DbSet<UserActivity> UserActivities { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<UserFollowing> Followings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.Entity<Value>()
        .HasData(
            new Value { Id = 1, Name = "Value 1" },
            new Value { Id = 2, Name = "Value 2" },
            new Value { Id = 3, Name = "Value 3" }
        );

      builder.Entity<UserActivity>(x => x.HasKey(ua =>
        new { ua.AppUserId, ua.ActivityId }));

      // each user has many activities
      builder.Entity<UserActivity>()
        .HasOne(u => u.AppUser)
        .WithMany(a => a.UserActivities)
        .HasForeignKey(u => u.AppUserId);

      // each activity has many users
      builder.Entity<UserActivity>()
        .HasOne(a => a.Activity)
        .WithMany(u => u.UserActivities)
        .HasForeignKey(a => a.ActivityId);

      builder.Entity<UserFollowing>(builder =>
      {
        builder.HasKey(k => new { k.ObserverId, k.TargetId });

        builder.HasOne(o => o.Observer)
          .WithMany(f => f.Followings)
          .HasForeignKey(o => o.ObserverId)
          .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Target)
          .WithMany(f => f.Followers)
          .HasForeignKey(o => o.TargetId)
          .OnDelete(DeleteBehavior.Restrict);
      });
    }
  }
}
