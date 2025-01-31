using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace Adwumawura.src.Commands;

public class PrivacyCommand : IBotCommand
{
   public string Name => "/privacy";

   public async Task ExecuteCommand(Update update, ITelegramBotClient botClient)
   {
      string commandMessage = "The [Bengi Privacy Policy](https://telegra.ph/Bengi-Privacy-Policy-07-14) by [Michael Osei Frimpong](oseifrimpongg.t.me)";

      await botClient.SendMessage(
         chatId: update?.Message?.From?.Id ?? long.Parse(Environment.GetEnvironmentVariable("ADMIN_ID") ?? "123456"),
         text: commandMessage,
         parseMode: ParseMode.Markdown,
         linkPreviewOptions: new LinkPreviewOptions() { PreferLargeMedia = true, ShowAboveText = false }
      );
   }
}
