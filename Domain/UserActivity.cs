using System;

namespace Domain
{
  public class UserActivity
  {
    // convention based, Net Core will recognize AppUserId belongs to AppUser and make that relationship automagically
    public string AppUserId { get; set; }
    public virtual AppUser AppUser { get; set; }
    public Guid ActivityId { get; set; }
    public virtual Activity Activity { get; set; }
    public DateTime DateJoined { get; set; }
    public bool IsHost { get; set; }
  }
}