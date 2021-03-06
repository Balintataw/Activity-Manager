using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;
using MediatR;
using Application.Activities;
using FluentValidation.AspNetCore;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Identity;
using Application.Interfaces;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using AutoMapper;
using Infrastructure.Photos;
using System.Threading.Tasks;
using API.SignalR;
using Application.Profiles;
using System;

namespace API
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureDevelopmentServices(IServiceCollection services)
    {

      services.AddDbContext<DataContext>(opt =>
      {
        opt.UseLazyLoadingProxies();
        opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      });
      ConfigureServices(services);
    }

    public void ConfigureProductionServices(IServiceCollection services)
    {

      services.AddDbContext<DataContext>(opt =>
      {
        opt.UseLazyLoadingProxies();
        // opt.UseMySql(Configuration.GetConnectionString("DefaultConnection"), opts => opts.EnableRetryOnFailure());
        opt.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"), opts => opts.EnableRetryOnFailure());
      });
      ConfigureServices(services);
    }
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddControllers(opt =>
      {
        // enforces authorization on all endpoints
        var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        opt.Filters.Add(new AuthorizeFilter(policy));
      }).AddFluentValidation(cfg =>
      {
        cfg.RegisterValidatorsFromAssemblyContaining<Create>();
      });

      services.AddCors(opts =>
      {
        opts.AddPolicy("CorsPolicy", policy =>
        {
          policy.AllowAnyHeader().AllowAnyMethod().WithExposedHeaders("WWW-Authenticate").WithOrigins("http://localhost:3000").AllowCredentials();
        });
      });

      services.AddMediatR(typeof(List.Handler).Assembly);
      services.AddSignalR();
      services.AddAutoMapper(typeof(List.Handler));

      // services.AddDbContext<DataContext>(opt =>
      // {
      //   opt.UseLazyLoadingProxies();
      //   opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
      // });

      var builder = services.AddIdentityCore<AppUser>();
      var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
      identityBuilder.AddEntityFrameworkStores<DataContext>();
      identityBuilder.AddSignInManager<SignInManager<AppUser>>();
      services.AddAuthorization(opt =>
      {
        opt.AddPolicy("IsActivityHost", policy =>
        {
          policy.Requirements.Add(new isHostRequirement());
        });
      });
      services.AddTransient<IAuthorizationHandler, isHostRequirementsHandler>();

      // Configuration comes from dotnet user-secrets in dev and appsettings.json in prod
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
      {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = key,
          ValidateAudience = false,
          ValidateIssuer = false,
          ValidateLifetime = true,
          ClockSkew = TimeSpan.Zero // eliminates 5 min leeway in token expiry check
        };
        opt.Events = new JwtBearerEvents
        {
          OnMessageReceived = context =>
          {
            // "access_token" set from client
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
            {
              context.Token = accessToken;
            }
            return Task.CompletedTask;
          }
        };
      });

      services.AddScoped<IJwtGenerator, JwtGenerator>();
      services.AddScoped<IUserAccessor, UserAccessor>();
      services.AddScoped<IPhotoAccessor, PhotoAccessor>();
      services.AddScoped<IProfileReader, ProfileReader>();
      services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary")); // refers to user-secrets
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      // error handling at the top
      app.UseMiddleware<ErrorHandlingMiddleware>();
      if (env.IsDevelopment())
      {
        // app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseHsts();
      }
      // securing response headers
      app.UseXContentTypeOptions();
      app.UseReferrerPolicy(opt => opt.NoReferrer());
      app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
      app.UseXfo(opt => opt.Deny());
      // app.UseCspReportOnly(opt => opt
      app.UseCsp(opt => opt
        .BlockAllMixedContent()
        .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com", "sha256-vO7sx3LWTL1uMXMyIVfkmu4W49kGsQhGFFtmmxJyzMA="))
        .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
        .FormActions(s => s.Self())
        .FrameAncestors(s => s.Self())
        .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "blob:", "data:"))
        .ScriptSources(s => s.Self().CustomSources("sha256-eE1k/Cs1U0Li9/ihPPQ7jKIGDvR8fYw65VJw+txfifw="))
      );

      // app.UseHttpsRedirection();

      // looks in wwwroot folder for serveable files * needs to come before UseStaticFiles*
      app.UseDefaultFiles();
      // needs to come before UseRouting
      app.UseStaticFiles();

      app.UseRouting();
      app.UseCors("CorsPolicy");

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
        endpoints.MapHub<ChatHub>("/chat");
        // tell api that any unknown routes are passed to react app
        endpoints.MapFallbackToController("Index", "Fallback");
      });
    }
  }
}
