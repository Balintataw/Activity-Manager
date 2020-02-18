using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      CreateMap<Comment, CommentDto>()
      .ForMember(destination => destination.Username, opts => opts.MapFrom(source => source.Author.UserName))
      .ForMember(destination => destination.DisplayName, opts => opts.MapFrom(source => source.Author.DisplayName))
      .ForMember(destination => destination.Image, opts => opts.MapFrom(source => source.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
    }
  }
}