// Dependencies
using Telegram.Bot;
using Telegram.Bot.Types;
using DotNetEnv;
using System.Reflection;
using Adwumawura.src.Commands;
using Telegram.Bot.Types.Enums;
using Adwumawura.src.Middleware;
using Adwumawura.src.Db;
using Adwumawura.Bot.src.QueryHandlers;

// Variables Setup
Env.Load();

// Variables
string BotToken = Environment.GetEnvironmentVariable("BOT_TOKEN") ?? "";
string Channel_Id = Environment.GetEnvironmentVariable("CHANNEL_ID") ?? "";
string MongoDbConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") ?? "";
string DatabaseName = Environment.GetEnvironmentVariable("DATABASE_NAME") ?? "";

// Setup
using CancellationTokenSource cts = new CancellationTokenSource();
// TelegramBotClient bot = new TelegramBotClient(token: BotToken, cancellationToken: cts.Token); // Production ready
TelegramBotClient bot = new TelegramBotClient("7709986675:AAECwsyQwRTgw7gTvReOKistEZ64V4YfFYY", cancellationToken: cts.Token); // Testing

Console.WriteLine($"Bot is active");

// Handle Commands
Dictionary<string, IBotCommand> commands = Assembly
                                             .GetExecutingAssembly()
                                             .GetTypes()
                                             .Where(type => typeof(IBotCommand).IsAssignableFrom(type) && !type.IsInterface && !type.IsAbstract)
                                             .Select(type => (IBotCommand)Activator.CreateInstance(type)!)
                                             .ToDictionary(cmd => cmd.Name, cmd => cmd);

// Handle Queries
Dictionary<string, IQueryHandler> queries = Assembly
                                             .GetExecutingAssembly()
                                             .GetTypes()
                                             .Where(type => typeof(IQueryHandler).IsAssignableFrom(type) && !type.IsInterface && !type.IsAbstract)
                                             .Select(type => (IQueryHandler)Activator.CreateInstance(type)!)
                                             .ToDictionary(query => query.GetType().Name.Replace("ProgrammeQueryHandler", "p").ToLower(), query => query);


ChannelSubscriptionMiddleware? channelMembershipStatus = new ChannelSubscriptionMiddleware(bot, Channel_Id);

var mongoClient = new MongoDbClient(MongoDbConnectionString, DatabaseName);
var usersCollection = mongoClient.GetUsers();

bot.StartReceiving(
   async (client, update, ct) =>
   {
      // Subscription & User Data Handler
      bool isSubscribed = await channelMembershipStatus.CheckSubscription(update);
      if (!isSubscribed && usersCollection is not null)
      {
         await mongoClient.SaveUserAsync(client, update, usersCollection);
         return;
      }

      // Message Handler
      if (update?.Type == UpdateType.Message && update.Message != null)
      {
         string? command = update?.Message?.Text?.Split(" ")[0];

         if (!string.IsNullOrEmpty(command) && commands.ContainsKey(command))
         {
            await commands[command].ExecuteCommand(update ?? new Update(), client);
         }
      }

      // Callbacks Handler
      if (update?.Type == UpdateType.CallbackQuery && update?.CallbackQuery != null)
      {
         string? callbackQueryData = update?.CallbackQuery?.Data;
         if (string.IsNullOrEmpty(callbackQueryData)) return;

         string queryKey = callbackQueryData.Split("/")[0];
         if (queries.ContainsKey(queryKey) && update is not null)
         {
            await queries[queryKey].HandleQuery(client, update);
         }
         return;
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