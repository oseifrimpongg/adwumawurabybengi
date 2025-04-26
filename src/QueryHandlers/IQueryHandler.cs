using Telegram.Bot;
using Telegram.Bot.Types;

namespace Adwumawura.Bot.src.QueryHandlers;

public interface IQueryHandler
{
   string Name { get; }
   Task HandleQuery(ITelegramBotClient telegramBotClient, Update update);
}