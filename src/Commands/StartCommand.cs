using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;

namespace Adwumawura.src.Commands;

public class StartCommand : IBotCommand
{
   public string Name => "/start";

   public async Task ExecuteCommand(Update update, ITelegramBotClient botClient)
   {
      string firstName = update?.Message?.Chat.FirstName ?? "user";

      string commandMessage = $"Hi {firstName}! I am Adwumawura, you personal guide to all your course materials. Let's make studying easier and more fun and easier together!🎓\nFirst, choose your programme of study to get started. 🚀";
      InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup(new[]
      {
         new []
         {
            InlineKeyboardButton.WithCallbackData("Midwifery", "midwifery"),
            InlineKeyboardButton.WithCallbackData("Nursing", "nursing"),
         },
         new []
         {
            InlineKeyboardButton.WithCallbackData("Emergency Nursing", "emergency_nursing")
         }
      });

      await botClient.SendMessage(
         chatId: update?.Message?.From?.Id ?? long.Parse(Environment.GetEnvironmentVariable("ADMIN_ID") ?? "123456"),
         text: commandMessage,
         replyMarkup: inlineKeyboardMarkup
      );
   }
}
