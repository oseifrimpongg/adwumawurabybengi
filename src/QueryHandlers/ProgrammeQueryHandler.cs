using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;

namespace Adwumawura.Bot.src.QueryHandlers;

public class ProgrammeQueryHandler : IQueryHandler
{
   public string Name => "p";

   public async Task HandleQuery(ITelegramBotClient botClient, Update update)
   {
      string? callbackQueryData = update?.CallbackQuery?.Data;
      if (callbackQueryData == null) return;

      Dictionary<string, (string Name, int Duration)> programmeData = new()
      {
         {"p/midwifery", ("Midwifery", 4)},
         {"p/nursing", ("Nursing", 4)},
         {"p/emergency_nursing", ("Emergency Nursing", 2)},
      };

      (string programmeName, int duration) = programmeData[callbackQueryData];

      List<List<InlineKeyboardButton>> inlineKeyboardRows = new();
      List<InlineKeyboardButton> yearButtons = new();
      for (int i = 1; i <= duration; i++)
      {
         yearButtons.Add(InlineKeyboardButton.WithCallbackData($"{i}", $"{callbackQueryData}/y{i}"));
      }

      inlineKeyboardRows.Add(yearButtons);
      inlineKeyboardRows.Add(new List<InlineKeyboardButton>() { InlineKeyboardButton.WithCallbackData("⬅️ Back", "back/start") });
      InlineKeyboardMarkup inlineKeyboard = new InlineKeyboardMarkup(inlineKeyboardRows);

      string commandMessage = $"Welcome to {programmeName}, please choose a year from the buttons below.";

      if (update?.CallbackQuery?.Message is null) return;

      await botClient.EditMessageText
      (
         chatId: update?.CallbackQuery?.From?.Id ?? long.Parse(Environment.GetEnvironmentVariable("ADMIN_ID") ?? "123456"),
         text: commandMessage,
         messageId: update.CallbackQuery.Message.Id,
         replyMarkup: inlineKeyboard
      );
   }
}