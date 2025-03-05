using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;

namespace Adwumawura.src.Commands;

public class StartCommand : IBotCommand
{
   public string Name => "/start";

   public async Task ExecuteCommand(ITelegramBotClient botClient, Update update)
   {
      (string commandMessage, InlineKeyboardMarkup inlineKeyboardMarkup) = GetStartMessage(update);

      await botClient.SendMessage(
         chatId: update?.Message?.From?.Id ?? long.Parse(Environment.GetEnvironmentVariable("ADMIN_ID") ?? "123456"),
         text: commandMessage,
         replyMarkup: inlineKeyboardMarkup
      );
   }

   public static (string message, InlineKeyboardMarkup inlineKeyboard) GetStartMessage(Update update)
   {
      string firstName = update?.Message?.Chat.FirstName ?? update?.CallbackQuery?.From?.FirstName ?? "user";

      string commandMessage = $"Hi {firstName}! I am Adwumawura, you personal guide to all your course materials. Let's make studying easier and more fun and easier together!🎓\nFirst, choose your programme of study to get started. 🚀";
      InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup(new[]
      {
         new []
         {
            InlineKeyboardButton.WithCallbackData("Midwifery", "p/midwifery"),
            InlineKeyboardButton.WithCallbackData("Nursing", "p/nursing"),
         },
         new []
         {
            InlineKeyboardButton.WithCallbackData("Emergency Nursing", "p/emergency_nursing")
         }
      });

      return (commandMessage, inlineKeyboardMarkup);
   }
}