using CumulioAPI;
using System.Dynamic;
using dotenv.net;
using System;
using JWT.Builder;
using JWT.Algorithms;
using JWT.Serializers;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => policy
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin());
});
var app = builder.Build();
DotEnv.Load();
var envVars = DotEnv.Read();
var Users = new List<User>();
Users.Add(new User("brad", "brad", "brad@mars-boots.com", "Mars Boots"));
Users.Add(new User("angelina", "angelina", "angelina@earthly-shoes.com", "Earthly Shoes"));


app.UseCors();

string JWT_SECRET = "randomSecretKey";


app.MapPost("/login", async delegate(HttpContext context)
{
    var token = "";
    using (StreamReader reader = new StreamReader(context.Request.Body, System.Text.Encoding.UTF8))
    {
        string jsonstring = await reader.ReadToEndAsync();
        // Create token
        var jsonObj = JsonConvert.DeserializeObject<LoginData>(jsonstring);

        foreach (User user in Users) {
            if (user.email.Equals(jsonObj.email)) {
                token = JwtBuilder.Create()
                            .WithAlgorithm(new HMACSHA256Algorithm())
                            .WithSecret(JWT_SECRET)
                            .AddClaim("username", user.username)
                            .AddClaim("email", user.email)
                            .AddClaim("brand", user.brand)
                            .AddClaim("name", user.name)
                            .Encode();
                break;
                
            }
        }
    }
    dynamic tokenObj = new ExpandoObject();
    tokenObj.token = token;
    return JsonConvert.SerializeObject(tokenObj);
});

app.MapGet("/", (HttpRequest httpRequest) => {
  Cumulio client = new Cumulio(envVars["CUMUL_KEY"], envVars["CUMUL_TOKEN"], envVars["API_URL"]);
  string tokenAuth = httpRequest.Headers["authorization"];
  string token = tokenAuth.Split(" ")[1];
  var user = JwtBuilder.Create()
                .WithAlgorithm(new HMACSHA256Algorithm())
                .WithSecret(JWT_SECRET)
                .Decode<User>(token);
  
  dynamic properties = new ExpandoObject();
  properties.integration_id = envVars["INTEGRATION_ID"];
  properties.type = "sso";
  properties.expiry = "24 hours";
  properties.inactivity_interval = "1 year";
  properties.username = user.username ?? envVars["USER_USERNAME"];
  properties.name = user.name ?? envVars["USER_NAME"];
  properties.email = user.email ?? envVars["USER_EMAIL"];
  properties.suborganization = envVars["USER_SUBORGANIZATION"];
  properties.role = "viewer";
  properties.metadata = new ExpandoObject();
  properties.metadata.brand = user.brand;

  dynamic authorization = client.create("authorization", properties);
  dynamic authResp = new ExpandoObject();

  authResp.key = authorization.id;
  authResp.token = authorization.token;
  authResp.status = "success";

  return JsonConvert.SerializeObject(authResp);
});

app.Run();
