using AutoMapper;
using Domain;

namespace Application.Activities
{
  public class MappingProfile : Profile
  {
    // for use with automapper from nuget
    public MappingProfile()
    {
      // any properties that are in both objects are mapped automatically
      CreateMap<Activity, ActivityDto>();
      CreateMap<UserActivity, AttendeeDto>()
        .ForMember(destination => destination.Username, opts => opts.MapFrom(source => source.AppUser.UserName))
        .ForMember(destination => destination.DisplayName, opts => opts.MapFrom(source => source.AppUser.DisplayName));
    }
  }
}