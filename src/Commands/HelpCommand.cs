using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;

namespace Adwumawura.src.Commands;

public class HelpCommand : IBotCommand
{
   public string Name => "/help";

   public async Task ExecuteCommand(ITelegramBotClient botClient, Update update)
   {
      string firstName = update?.Message?.Chat.FirstName ?? "user";
      string commandMessage = $"Welcome to the *Help Desk* 👨🏾‍💻 {firstName}\nHow can I assist you?";
      InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup(new[]
      {
         new []
         {
            InlineKeyboardButton.WithUrl("Report a Problem 🤔", "oseifrimpongg.t.me")
         },
      });

      await botClient.SendMessage(
               chatId: update?.Message?.From?.Id ?? long.Parse(Environment.GetEnvironmentVariable("ADMIN_ID") ?? "123456"),
               text: commandMessage,
               replyMarkup: inlineKeyboardMarkup
            );
   }
}
