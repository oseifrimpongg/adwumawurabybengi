using Telegram.Bot;
using Telegram.Bot.Types;
using Adwumawura.src.Commands;
using Telegram.Bot.Types.ReplyMarkups;


namespace Adwumawura.Bot.src.QueryHandlers;

public class GoBackHandler : IQueryHandler
{
   public string Name => "back";

   public async Task HandleQuery(ITelegramBotClient botClient, Update update)
   {
      (string commandMessage, InlineKeyboardMarkup inlineKeyboard) = StartCommand.GetStartMessage(update);

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