using Telegram.Bot;
using Telegram.Bot.Types;

namespace Adwumawura.src.Commands;

public interface IBotCommand
{
   string Name { get; }
   Task ExecuteCommand(Update update, ITelegramBotClient botClient);
}
