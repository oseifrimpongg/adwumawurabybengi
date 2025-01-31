// Dependencies
using Telegram.Bot;
using Telegram.Bot.Types;
using DotNetEnv;
using System.Reflection;
using Adwumawura.src.Commands;
using Telegram.Bot.Types.Enums;
using Adwumawura.src.Middleware;
using MongoDB.Driver;
using Adwumawura.src.Db;
using MongoDB.Bson;

// Variables Setup
Env.Load();

// Variables
string BotToken = Environment.GetEnvironmentVariable("BOT_TOKEN") ?? "";
string Channel_Id = Environment.GetEnvironmentVariable("CHANNEL_ID") ?? "";
string MongoDbConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") ?? "";
string DatabaseName = Environment.GetEnvironmentVariable("DATABASE_NAME") ?? "";

// Setup
using CancellationTokenSource cts = new CancellationTokenSource();
TelegramBotClient bot = new TelegramBotClient(token: BotToken, cancellationToken: cts.Token);

Console.WriteLine($"Bot is active");

// Handle Commands
Dictionary<string, IBotCommand> commands = Assembly
                                             .GetExecutingAssembly()
                                             .GetTypes()
                                             .Where(type => typeof(IBotCommand).IsAssignableFrom(type) && !type.IsInterface && !type.IsAbstract)
                                             .Select(type => (IBotCommand)Activator.CreateInstance(type)!)
                                             .ToDictionary(cmd => cmd.Name, cmd => cmd);

ChannelSubscriptionMiddleware? channelMembershipStatus = new ChannelSubscriptionMiddleware(bot, Channel_Id);

var mongoClient = new MongoDbClient(MongoDbConnectionString, DatabaseName);
var usersCollection = mongoClient.GetUsers();

bot.StartReceiving(
   async (client, update, ct) =>
   {
      bool isSubscribed = await channelMembershipStatus.CheckSubscription(update);
      if (!isSubscribed) return;

      User userUpdate = update.Message.From;
      if (userUpdate is null) return;

      var existingUser = usersCollection.Find(u => u.UserId == userUpdate.Id).FirstOrDefault();

      if (existingUser is null)
      {
         var user = new UserModel()
         {
            Id = ObjectId.GenerateNewId(),
            UserId = userUpdate.Id,
            UserName = userUpdate?.Username,
            FirstName = userUpdate?.FirstName,
            LastName = userUpdate?.LastName,
            JoinDate = DateTime.Now,
            SubscriptionStatus = isSubscribed
         };

         try
         {
            await usersCollection.InsertOneAsync(user);
         }
         catch (Exception exception)
         {
            Console.WriteLine($"${exception.Message}");
         }

      }

      if (update.Type == UpdateType.Message && update.Message != null)
      {
         string? command = update?.Message?.Text?.Split(" ")[0];

         if (!string.IsNullOrEmpty(command) && commands.ContainsKey(command))
         {
            await commands[command].ExecuteCommand(update ?? new Update(), client);
         }
      }
   },
   (client, exception, ct) =>
   {
      Console.WriteLine($"{exception.Message}");
      return Task.CompletedTask;
   }
   , cancellationToken: cts.Token

);

Console.ReadLine();
cts.Cancel();

