using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class Unattend
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly IUserAccessor _userAccessor;
      public Handler(DataContext context, IUserAccessor userAccessor)
      {
        _userAccessor = userAccessor;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {

        // get the activity from provided request id
        var activity = await _context.Activities.FindAsync(request.Id);
        if (activity == null)
          throw new RestException(HttpStatusCode.NotFound,
          new { Activity = "Could not find activity" });

        var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());
        // if user is not defined there will be an unauthed exception thrown already

        var attendance = await _context.UserActivities
            .SingleOrDefaultAsync(a => a.ActivityId == activity.Id && a.AppUserId == user.Id);

        // user isnt attending, just exit out of the handler
        if (attendance == null)
          return Unit.Value;

        // user cannot unattend an activity they are host of
        if (attendance.IsHost)
          throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "You cannot remove yourself as host" });

        _context.UserActivities.Remove(attendance);

        var success = await _context.SaveChangesAsync() > 0;

        if (success) return Unit.Value;

        throw new Exception("Problem saving changes");
      }
    }
  }
}