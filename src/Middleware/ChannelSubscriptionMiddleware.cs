using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

namespace Adwumawura.src.Middleware;

public class ChannelSubscriptionMiddleware
{
   private readonly ITelegramBotClient _botClient;
   private readonly string _channelId;
   private readonly string _subscriptionReminder = "Hello there!\nIn order to be able to use the bot please join [Bengi News](benginews.t.me). Then return to the bot and type /start";

   public ChannelSubscriptionMiddleware(ITelegramBotClient botClient, string channelId)
   {
      _botClient = botClient;
      _channelId = channelId;
   }

   public async Task<bool> CheckSubscription(Update update)
   {
      if (update.Type != UpdateType.Message) return true;
      if (update?.Message?.From?.Id == null) return true;

      try
      {
         var userId = update.Message.From.Id;
         var chatMember = _botClient.GetChatMember(new ChatId(_channelId), userId).Result;

         bool isCreatorStatus = chatMember.Status == ChatMemberStatus.Creator;
         bool isMemberStatus = chatMember.Status == ChatMemberStatus.Member;
         bool isAdministratorStatus = chatMember.Status == ChatMemberStatus.Administrator;

         if (!isMemberStatus && !isCreatorStatus && !isAdministratorStatus)
         {
            await _botClient.SendMessage(
               chatId: userId,
               text: _subscriptionReminder,
               parseMode: ParseMode.Markdown
            );

            return false;
         }

         return true;
      }
      catch (Exception e)
      {
         Console.WriteLine($"{e.Message}\n{e.Data}\n{e.Source}\n{e.ToString}");
         return false;
      }
   }
}
