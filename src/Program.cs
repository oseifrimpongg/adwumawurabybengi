// Dependencies
using Telegram.Bot;
using Telegram.Bot.Types;
using DotNetEnv;
using System.Reflection;
using Adwumawura.src.Commands;
using Telegram.Bot.Types.Enums;
using Adwumawura.src.Middleware;

// Variables Setup
Env.Load();

// Setup
using CancellationTokenSource cts = new CancellationTokenSource();
TelegramBotClient bot = new TelegramBotClient(token: Environment.GetEnvironmentVariable("BOT_TOKEN") ?? "", cancellationToken: cts.Token);

Console.WriteLine($"Bot is active");

// Handle Commands
Dictionary<string, IBotCommand> commands = Assembly
                                             .GetExecutingAssembly()
                                             .GetTypes()
                                             .Where(type => typeof(IBotCommand).IsAssignableFrom(type) && !type.IsInterface && !type.IsAbstract)
                                             .Select(type => (IBotCommand)Activator.CreateInstance(type)!)
                                             .ToDictionary(cmd => cmd.Name, cmd => cmd);

ChannelSubscriptionMiddleware? channelMembershipStatus = new ChannelSubscriptionMiddleware(bot, Environment.GetEnvironmentVariable("CHANNEL_ID") ?? "");

bot.StartReceiving(
   async (client, update, ct) =>
   {
      bool isSubscribed = await channelMembershipStatus.CheckSubscription(update);
      if (!isSubscribed) return;

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

